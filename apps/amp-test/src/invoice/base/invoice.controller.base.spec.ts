import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { InvoiceController } from "../invoice.controller";
import { InvoiceService } from "../invoice.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  createdAt: new Date(),
  dueDate: new Date(),
  id: 42,
  paidDate: new Date(),
  price: 42,
  taxPointDate: new Date(),
  updatedAt: new Date(),
  uuid: "exampleUuid",
};
const CREATE_RESULT = {
  createdAt: new Date(),
  dueDate: new Date(),
  id: 42,
  paidDate: new Date(),
  price: 42,
  taxPointDate: new Date(),
  updatedAt: new Date(),
  uuid: "exampleUuid",
};
const FIND_MANY_RESULT = [
  {
    createdAt: new Date(),
    dueDate: new Date(),
    id: 42,
    paidDate: new Date(),
    price: 42,
    taxPointDate: new Date(),
    updatedAt: new Date(),
    uuid: "exampleUuid",
  },
];
const FIND_ONE_RESULT = {
  createdAt: new Date(),
  dueDate: new Date(),
  id: 42,
  paidDate: new Date(),
  price: 42,
  taxPointDate: new Date(),
  updatedAt: new Date(),
  uuid: "exampleUuid",
};

const service = {
  create() {
    return CREATE_RESULT;
  },
  findMany: () => FIND_MANY_RESULT,
  findOne: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("Invoice", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: InvoiceService,
          useValue: service,
        },
      ],
      controllers: [InvoiceController],
      imports: [MorganModule.forRoot(), ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /invoices", async () => {
    await request(app.getHttpServer())
      .post("/invoices")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        dueDate: CREATE_RESULT.dueDate.toISOString(),
        paidDate: CREATE_RESULT.paidDate.toISOString(),
        taxPointDate: CREATE_RESULT.taxPointDate.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test("GET /invoices", async () => {
    await request(app.getHttpServer())
      .get("/invoices")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          dueDate: FIND_MANY_RESULT[0].dueDate.toISOString(),
          paidDate: FIND_MANY_RESULT[0].paidDate.toISOString(),
          taxPointDate: FIND_MANY_RESULT[0].taxPointDate.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
        },
      ]);
  });

  test("GET /invoices/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/invoices"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /invoices/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/invoices"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        dueDate: FIND_ONE_RESULT.dueDate.toISOString(),
        paidDate: FIND_ONE_RESULT.paidDate.toISOString(),
        taxPointDate: FIND_ONE_RESULT.taxPointDate.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  test("POST /invoices existing resource", async () => {
    let agent = request(app.getHttpServer());
    await agent
      .post("/invoices")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        dueDate: CREATE_RESULT.dueDate.toISOString(),
        paidDate: CREATE_RESULT.paidDate.toISOString(),
        taxPointDate: CREATE_RESULT.taxPointDate.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/invoices")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
