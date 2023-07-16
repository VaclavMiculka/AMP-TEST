/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import { OrganizationService } from "../organization.service";
import { Public } from "../../decorators/public.decorator";
import { OrganizationCreateInput } from "./OrganizationCreateInput";
import { OrganizationWhereInput } from "./OrganizationWhereInput";
import { OrganizationWhereUniqueInput } from "./OrganizationWhereUniqueInput";
import { OrganizationFindManyArgs } from "./OrganizationFindManyArgs";
import { OrganizationUpdateInput } from "./OrganizationUpdateInput";
import { Organization } from "./Organization";

export class OrganizationControllerBase {
  constructor(protected readonly service: OrganizationService) {}
  @Public()
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Organization })
  async create(
    @common.Body() data: OrganizationCreateInput
  ): Promise<Organization> {
    return await this.service.create({
      data: {
        ...data,

        invoices: data.invoices
          ? {
              connect: data.invoices,
            }
          : undefined,
      },
      select: {
        code: true,
        createdAt: true,
        id: true,

        invoices: {
          select: {
            id: true,
          },
        },

        name: true,
        updatedAt: true,
        uuid: true,
      },
    });
  }

  @Public()
  @common.Get()
  @swagger.ApiOkResponse({ type: [Organization] })
  @ApiNestedQuery(OrganizationFindManyArgs)
  async findMany(@common.Req() request: Request): Promise<Organization[]> {
    const args = plainToClass(OrganizationFindManyArgs, request.query);
    return this.service.findMany({
      ...args,
      select: {
        code: true,
        createdAt: true,
        id: true,

        invoices: {
          select: {
            id: true,
          },
        },

        name: true,
        updatedAt: true,
        uuid: true,
      },
    });
  }

  @Public()
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Organization })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async findOne(
    @common.Param() params: OrganizationWhereUniqueInput
  ): Promise<Organization | null> {
    const result = await this.service.findOne({
      where: params,
      select: {
        code: true,
        createdAt: true,
        id: true,

        invoices: {
          select: {
            id: true,
          },
        },

        name: true,
        updatedAt: true,
        uuid: true,
      },
    });
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @Public()
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Organization })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async update(
    @common.Param() params: OrganizationWhereUniqueInput,
    @common.Body() data: OrganizationUpdateInput
  ): Promise<Organization | null> {
    try {
      return await this.service.update({
        where: params,
        data: {
          ...data,

          invoices: data.invoices
            ? {
                connect: data.invoices,
              }
            : undefined,
        },
        select: {
          code: true,
          createdAt: true,
          id: true,

          invoices: {
            select: {
              id: true,
            },
          },

          name: true,
          updatedAt: true,
          uuid: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @Public()
  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Organization })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async delete(
    @common.Param() params: OrganizationWhereUniqueInput
  ): Promise<Organization | null> {
    try {
      return await this.service.delete({
        where: params,
        select: {
          code: true,
          createdAt: true,
          id: true,

          invoices: {
            select: {
              id: true,
            },
          },

          name: true,
          updatedAt: true,
          uuid: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }
}
