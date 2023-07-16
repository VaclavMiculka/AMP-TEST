import { Module } from "@nestjs/common";
import { InvoiceModuleBase } from "./base/invoice.module.base";
import { InvoiceService } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";

@Module({
  imports: [InvoiceModuleBase],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
