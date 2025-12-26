-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "deadline" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
