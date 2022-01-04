-- AddForeignKey
ALTER TABLE "AlternateName" ADD CONSTRAINT "AlternateName_geonameId_fkey" FOREIGN KEY ("geonameId") REFERENCES "Geoname"("id") ON DELETE SET NULL ON UPDATE CASCADE;
