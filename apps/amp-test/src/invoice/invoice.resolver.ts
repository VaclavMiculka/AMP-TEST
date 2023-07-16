import * as graphql from "@nestjs/graphql";
import { InvoiceResolverBase } from "./base/invoice.resolver.base";
import { Invoice } from "./base/Invoice";
import { InvoiceService } from "./invoice.service";

@graphql.Resolver(() => Invoice)
export class InvoiceResolver extends InvoiceResolverBase {
  constructor(protected readonly service: InvoiceService) {
    super(service);
  }
}
