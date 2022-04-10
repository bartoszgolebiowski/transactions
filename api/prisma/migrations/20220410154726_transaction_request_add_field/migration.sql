/*
  Warnings:

  - Added the required column `active` to the `TransactionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransactionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "active" BOOLEAN NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "TransactionRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransactionRequest" ("amount", "createdAt", "description", "id", "ownerId") SELECT "amount", "createdAt", "description", "id", "ownerId" FROM "TransactionRequest";
DROP TABLE "TransactionRequest";
ALTER TABLE "new_TransactionRequest" RENAME TO "TransactionRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
