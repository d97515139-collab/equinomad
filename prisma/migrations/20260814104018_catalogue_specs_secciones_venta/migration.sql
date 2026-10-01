-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "saleMode" TEXT NOT NULL DEFAULT 'cart',
ADD COLUMN     "sourceRef" TEXT,
ADD COLUMN     "specs" TEXT NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "ProductSection" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "headingEn" TEXT NOT NULL DEFAULT '',
    "bodyEn" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductSection_productId_idx" ON "ProductSection"("productId");

-- AddForeignKey
ALTER TABLE "ProductSection" ADD CONSTRAINT "ProductSection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
