import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { InvoiceService } from "./invoice.service";
import { InvoiceControllerBase } from "./base/invoice.controller.base";

@swagger.ApiTags("invoices")
@common.Controller("invoices")
export class InvoiceController extends InvoiceControllerBase {
  constructor(protected readonly service: InvoiceService) {
    super(service);
  }
}
