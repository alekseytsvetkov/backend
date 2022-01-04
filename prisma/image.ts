import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();

const blockList = ['gerb', '.svg.', 'coat', 'flag'];

const wikipedia = 'en';

const getImage = (title: string) => {
  if (!title) {
    return null;
  }

  return axios
    .get(
      `https://${wikipedia}.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&origin=*&pithumbsize=1024`,
    )
    .then((res) => {
      // @ts-ignore
      const pageId = Object.keys(res.data.query.pages)[0];

      // @ts-ignore
      const hasThumbnail = res.data.query.pages[pageId].thumbnail;

      if (!hasThumbnail) {
        return null;
      }

      console.log(
        '29 line, thumbnal.source',
        res.data.query.pages[pageId].thumbnail.source,
      );

      return res.data.query.pages[pageId].thumbnail.source;
    });
};

const getSummary = (title) => {
  return axios
    .get(`https://${wikipedia}.wikipedia.org/api/rest_v1/page/summary/${title}`)
    .then(function (response) {
      return response.data;
    })
    .then(function (json) {
      const data = json;

      const Obj = {
        status: 'success',
        data: {
          title: data.title,
          abstract: data.description,
          id: data.pageid,
          content: data.extract,
          url: `http://${wikipedia}.wikipedia.org/?curid=` + data.pageid,
        },
      };

      return Obj;
    })
    .catch((error) => {
      if (error) {
        return null;
      }
    });
};

const checkImage = (url: string) => {
  const found = blockList.find((word) => url.includes(word));

  if (found) {
    return null;
  }

  return url;
};

async function main() {
  console.log('Starting...');

  const geonames = await prisma.geoname.findMany({
    orderBy: [
      {
        population: 'desc',
      },
    ],
  });

  console.log('geonames length', geonames.length);

  for (let i = 0; i < geonames.length; i++) {
    const geoname = geonames[i];

    console.log(geoname.asciiName);

    // @ts-ignore
    const content = await getSummary(geoname.asciiName).then((data) => {
      if (!data) {
        return null;
      }
      //@ts-ignore
      const content = data.data.content;
      return content;
    });

    const image = await getImage(geoname.asciiName);

    if (image) {
      const checkedImage = checkImage(image);

      if (checkedImage) {
        console.log('Checked image: ', checkedImage);
        const image = await prisma.image.findFirst({
          where: {
            url: checkedImage,
          },
        });

        if (!image || image.url !== checkedImage) {
          await prisma.image.create({
            data: {
              url: checkedImage,
              geonameId: geoname.id,
            },
          });
          console.log(`Image for ${geoname.asciiName} created!`);
        }
      }
    }

    if (content) {
      console.log('content', content);
    }

    if (content) {
      await prisma.geoname.update({
        where: {
          id: geoname.id,
        },
        data: {
          overview: content,
        },
      });

      console.log(`Overview for ${geoname.asciiName} updated!`);
    }
  }

  // GET IMAGE BY WKDT

  // get wikipedia title by wikidata id
  // https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=Q2592&sitefilter=enwiki

  // get image by wikipedia title (and select size)
  // https://en.wikipedia.org/w/api.php?action=query&titles=Kostroma&prop=pageimages&format=json&pithumbsize=1024

  // const size = '1024';

  // const wkdtList = await prisma.alternateName.findMany({
  //   where: {
  //     isoLang: 'wkdt',
  //   },
  // });

  // console.log('wkdtList', wkdtList.length);

  // for (let i = 0; i < wkdtList.length; i++) {
  //   console.log('i: ', i);

  //   const wikidataId = wkdtList[i].alternateName;

  //   const imageExists = await prisma.image.findFirst({
  //     where: {
  //       geonameId: wkdtList[i].geonameId,
  //     },
  //   });

  //   console.log('imageExists', imageExists);

  //   if (!imageExists) {
  //     await axios
  //       .get(
  //         `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${wkdtList[i].alternateName}&sitefilter=enwiki`,
  //       )
  //       .then(async (response) => {
  //         const hasLinks =
  //           // @ts-ignore
  //           Object.keys(response.data.entities[wikidataId].sitelinks).length >
  //           0;

  //         if (hasLinks) {
  //           const title =
  //             // @ts-ignore
  //             response.data.entities[wikidataId].sitelinks.enwiki.title;
  //           console.log('title: ', title, 'id', wikidataId);

  //           await axios
  //             .get(
  //               `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=${size}`,
  //             )
  //             .then(async (response) => {
  //               // @ts-ignore
  //               const pageId = Object.keys(response.data.query.pages)[0];

  //               // @ts-ignore
  //               const hasThumbnail =
  //                 response.data.query.pages[pageId].thumbnail;

  //               if (hasThumbnail) {
  //                 // @ts-ignore
  //                 console.log(
  //                   response.data.query.pages[pageId].thumbnail.source,
  //                 );

  //                 const url =
  //                   response.data.query.pages[pageId].thumbnail.source;

  //                 if (!url.includes('.svg.')) {
  //                   await prisma.image.create({
  //                     data: {
  //                       // @ts-ignore
  //                       url: response.data.query.pages[pageId].thumbnail.source,
  //                       geoname: {
  //                         connect: {
  //                           id: wkdtList[i].geonameId,
  //                         },
  //                       },
  //                     },
  //                   });
  //                   console.log(`saved image for ${title}`);
  //                 } else {
  //                   console.log(`skip for ${title}`);
  //                 }
  //               }
  //             })
  //             .catch(function (error) {
  //               console.log(error);
  //             });
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
