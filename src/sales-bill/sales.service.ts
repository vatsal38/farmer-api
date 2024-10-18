import { GlobalMasterService } from './../global-master/global-master.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { BillSchema, Sales } from './sales.schema';
import { UpdateBillDto } from './update-sales.dto';
@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly globalMasterService: GlobalMasterService,
  ) {}

  private calculateAdditionalFields(
    billList: BillSchema[],
    basePrice: any,
    webCommission: any,
    appCommission: any,
    baseCommission: any,
    hamaliPrice: any,
    marketFeesPrice: any,
    isWebLogin: any,
  ) {
    let uBags = 0;
    let totalWeight = 0;
    let totalPrice = 0;

    billList.forEach((bill) => {
      if (bill.bags > 0) uBags += bill.bags;
      totalWeight += bill.weight;
      const total = (bill.weight * bill.price) / Number(basePrice);
      const commission =
        (total * isWebLogin ? Number(webCommission) : Number(appCommission)) /
        100;
      const tPrice = total + commission;
      totalPrice += tPrice;
    });
    const bBags = billList
      .filter((bill) => bill.bags < 0)
      .reduce((acc, bill) => acc + bill.bags, 0);
    const marketFee = Number(
      ((totalPrice * Number(marketFeesPrice)) / 100).toFixed(2),
    );
    const commission = Number(
      ((totalPrice * Number(baseCommission)) / 100).toFixed(2),
    );
    const hamali = Number((uBags * Number(hamaliPrice)).toFixed(2));

    return { uBags, bBags, totalWeight, marketFee, commission, hamali };
  }

  async create(sales: Sales, userId: string): Promise<Sales> {
    try {
      return await this.salesRepository.create(sales, userId);
    } catch (error) {
      console.log('error::: ', error);
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create sales');
      }
    }
  }

  async findAll(
    userId: string,
    isWebLogin: boolean,
    page?: number,
    limit?: number,
    search?: string,
    isSuperAdmin?: boolean,
  ) {
    const {
      basePrice,
      webCommission,
      appCommission,
      commission: baseCommission,
      hamali: hamaliPrice,
      marketFees: marketFeesPrice,
    } = await this.globalMasterService.findOne(userId);

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.salesRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.salesRepository.countAll(userId, search, isSuperAdmin),
      ]);
      const salesWithAdditionalFields = items.map((sales: any) => {
        const { uBags, bBags, totalWeight, marketFee, commission, hamali } =
          this.calculateAdditionalFields(
            sales.billList,
            basePrice,
            webCommission,
            appCommission,
            baseCommission,
            hamaliPrice,
            marketFeesPrice,
            isWebLogin,
          );
        return {
          ...sales.toObject(),
          uBags,
          bBags,
          totalWeight,
          marketFee,
          commission,
          hamali,
        };
      });

      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items: salesWithAdditionalFields,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.salesRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );

      const salesWithAdditionalFields = items.map((sales: any) => {
        const { uBags, bBags, totalWeight, marketFee, commission, hamali } =
          this.calculateAdditionalFields(
            sales.billList,
            basePrice,
            webCommission,
            appCommission,
            baseCommission,
            hamaliPrice,
            marketFeesPrice,
            isWebLogin,
          );
        return {
          ...sales.toObject(),
          uBags,
          bBags,
          totalWeight,
          marketFee,
          commission,
          hamali,
        };
      });

      return salesWithAdditionalFields;
    }
  }

  async findOne(id: string): Promise<Sales> {
    const sales = await this.salesRepository.findOne(id);
    if (!sales) {
      throw new NotFoundException('Sales not found');
    }
    return sales;
  }

  async update(id: string, sales: any, userId: string): Promise<Sales> {
    try {
      const existSales = await this.salesRepository.findOne(id);
      if (!existSales) {
        throw new NotFoundException('Sales not found');
      }

      const newBill: any = {
        productId: sales.productId,
        weight: sales.weight,
        price: sales.price,
        bags: sales.bags,
        finalAmount: sales.finalAmount,
        type: sales.type,
      };

      return this.salesRepository.update(id, newBill);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update sales');
      }
    }
  }

  async remove(id: string): Promise<Sales> {
    try {
      const deletedSales = await this.salesRepository.remove(id);
      if (!deletedSales) {
        throw new NotFoundException('Sales not found');
      }
      return deletedSales;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete sales',
          error.message,
        );
      }
    }
  }

  async updateBillById(
    salesId: string,
    billId: string,
    updateBillingDto: UpdateBillDto,
  ): Promise<Sales> {
    const billing = await this.salesRepository.findBillingById(salesId, billId);

    if (!billing) {
      throw new NotFoundException(
        `Billing record with ID ${salesId} not found`,
      );
    }

    const updatedBill = {
      productId: updateBillingDto.productId,
      weight: updateBillingDto.weight,
      price: updateBillingDto.price,
      bags: updateBillingDto.bags,
      finalAmount: updateBillingDto.finalAmount,
      type: updateBillingDto.type,
    };

    return this.salesRepository.updateBillById(salesId, billId, updatedBill);
  }

  async deleteBillById(salesId: string, billId: string): Promise<Sales> {
    const billing = await this.salesRepository.findBillingById(salesId, billId);

    if (!billing) {
      throw new NotFoundException(
        `Billing record with ID ${salesId} not found`,
      );
    }

    return this.salesRepository.deleteBillById(salesId, billId);
  }
}
