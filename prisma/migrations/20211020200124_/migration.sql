-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('RU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "wantedCount" INTEGER NOT NULL DEFAULT 0,
    "visitedCount" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "password" TEXT NOT NULL,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContinentCode" (
    "id" TEXT NOT NULL,
    "code" CHAR(2),
    "name" TEXT,
    "geonameId" TEXT,

    CONSTRAINT "ContinentCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryInfo" (
    "isoAlpha2" CHAR(2) NOT NULL,
    "isoAlpha3" CHAR(3),
    "isoNumeric" INTEGER,
    "fipsCode" TEXT,
    "country" TEXT,
    "emoji" TEXT,
    "emojiU" TEXT,
    "capital" TEXT,
    "area" DOUBLE PRECISION,
    "population" INTEGER,
    "continentCode" CHAR(2),
    "tld" TEXT,
    "currencyCode" CHAR(3),
    "currencyName" TEXT,
    "phone" TEXT,
    "postal" TEXT,
    "postalRegex" TEXT,
    "languages" TEXT,
    "neighbours" TEXT,
    "equivalentFipsCode" TEXT,
    "geonameId" TEXT,

    CONSTRAINT "CountryInfo_pkey" PRIMARY KEY ("isoAlpha2")
);

-- CreateTable
CREATE TABLE "Geoname" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "asciiName" TEXT,
    "alternateNames" TEXT,
    "overview" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "fclass" CHAR(1),
    "fcode" CHAR(10),
    "countryCode" CHAR(2),
    "cc2" TEXT,
    "admin1" TEXT,
    "admin2" TEXT,
    "admin3" TEXT,
    "admin4" TEXT,
    "population" BIGINT,
    "elevation" INTEGER,
    "gtopo30" INTEGER,
    "timezone" TEXT,
    "modifiedDate" DATE,
    "wantedCount" INTEGER NOT NULL DEFAULT 0,
    "visitedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Geoname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlternateName" (
    "id" TEXT NOT NULL,
    "isoLang" TEXT,
    "alternateName" TEXT,
    "isPreferredName" BOOLEAN,
    "isShortName" BOOLEAN,
    "isColloquial" BOOLEAN,
    "isHistoric" BOOLEAN,
    "from" TEXT,
    "to" TEXT,
    "geonameId" TEXT,

    CONSTRAINT "AlternateName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagLocalization" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TagLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "previewTitle" TEXT NOT NULL,
    "previewImage" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryLocalization" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "previewTitle" TEXT NOT NULL,
    "storyId" TEXT,

    CONSTRAINT "StoryLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "storyId" TEXT,

    CONSTRAINT "StoryStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryStepLocalization" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storyStepId" TEXT,

    CONSTRAINT "StoryStepLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "geonameId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VisitedGeoname" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WantedGeoname" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GeonameToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContinentCode_code_key" ON "ContinentCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CountryInfo_isoAlpha2_key" ON "CountryInfo"("isoAlpha2");

-- CreateIndex
CREATE UNIQUE INDEX "Geoname_id_key" ON "Geoname"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlternateName_id_key" ON "AlternateName"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_VisitedGeoname_AB_unique" ON "_VisitedGeoname"("A", "B");

-- CreateIndex
CREATE INDEX "_VisitedGeoname_B_index" ON "_VisitedGeoname"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WantedGeoname_AB_unique" ON "_WantedGeoname"("A", "B");

-- CreateIndex
CREATE INDEX "_WantedGeoname_B_index" ON "_WantedGeoname"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GeonameToTag_AB_unique" ON "_GeonameToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_GeonameToTag_B_index" ON "_GeonameToTag"("B");

-- AddForeignKey
ALTER TABLE "ContinentCode" ADD CONSTRAINT "ContinentCode_geonameId_fkey" FOREIGN KEY ("geonameId") REFERENCES "Geoname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryInfo" ADD CONSTRAINT "CountryInfo_geonameId_fkey" FOREIGN KEY ("geonameId") REFERENCES "Geoname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternateName" ADD CONSTRAINT "AlternateName_geonameId_fkey" FOREIGN KEY ("geonameId") REFERENCES "Geoname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagLocalization" ADD CONSTRAINT "TagLocalization_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryLocalization" ADD CONSTRAINT "StoryLocalization_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryStep" ADD CONSTRAINT "StoryStep_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryStepLocalization" ADD CONSTRAINT "StoryStepLocalization_storyStepId_fkey" FOREIGN KEY ("storyStepId") REFERENCES "StoryStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_geonameId_fkey" FOREIGN KEY ("geonameId") REFERENCES "Geoname"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VisitedGeoname" ADD FOREIGN KEY ("A") REFERENCES "Geoname"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VisitedGeoname" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WantedGeoname" ADD FOREIGN KEY ("A") REFERENCES "Geoname"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WantedGeoname" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeonameToTag" ADD FOREIGN KEY ("A") REFERENCES "Geoname"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeonameToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
