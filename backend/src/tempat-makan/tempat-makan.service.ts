import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TempatMakanDto } from './dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires

@Injectable()
export class TempatMakanService {
  constructor(private prisma: PrismaService) { }

  // Get all tempat makan
  async getAllTempatMakan(param, query) {
    // Filter by category
    let categoryArray
    if (query.filter_category) {
      categoryArray = query.filter_category.split(';')
    }

    // Filter by price
    let priceArray = []
    if (query.filter_price) {
      priceArray = query.filter_price.split(';')
    }

    // Filter by platform
    let platformArray
    if (query.filter_platform) {
      platformArray = query.filter_platform.split(';')
    }

    // Filter by transaction
    let paymentArray
    if (query.filter_payment) {
      paymentArray = query.filter_payment.split(';')
    }

    // Search
    const searchString = query.search

    // Campus
    const campus = param.campus
    if (campus !== 'ganesha' && campus !== 'jatinangor') {
      throw new NotFoundException('Not Found')
    }

    // Sort status
    let sortStatus = query.sort_status
    if (sortStatus && sortStatus !== 'asc' && sortStatus !== 'desc') {
      throw new BadRequestException('Bad Request')
    } else if (sortStatus === '') {
      sortStatus = undefined
    }

    let sortData = query.sort_data
    if (sortData && sortData !== 'rating' && sortData !== 'distance' && sortData !== 'price') {
      throw new BadRequestException('Bad Request')
    } else if (sortData === '') {
      sortData = 'rating'
    }

    const orderBy = {}
    orderBy[sortData] = sortStatus

    const dataAllTempatMakan = await this.prisma.tempatMakan.findMany({
      orderBy,
      where: {
        campus: campus.toUpperCase(),
        OR: [
          {
            name: {
              contains: searchString,
              mode: 'insensitive'
            }
          },
          {
            categories: {
              some: {
                name: {
                  contains: searchString,
                  mode: 'insensitive'
                }
              }
            }
          },
          {
            description: {
              contains: searchString,
              mode: 'insensitive'
            }
          }
        ],
        AND: [
          {
            categories: {
              some: {
                name: {
                  in: categoryArray,
                  mode: 'insensitive'
                }
              }
            }
          },
          {
            price: {
              gte: priceArray[0] ? +priceArray[0] : undefined,
              lte: priceArray[1] ? +priceArray[1] : undefined,
            }
          },
          {
            platforms: {
              some: {
                name: {
                  in: platformArray,
                  mode: 'insensitive'
                }
              }
            }
          },
          {
            paymentMethods: {
              some: {
                name: {
                  in: paymentArray,
                  mode: 'insensitive'
                }
              }
            }
          }
        ],
      },
      select: {
        name: true,
        description: true,
        imageUrl: true,
        price: true,
        address: true,
        latitude: true,
        longitude: true,
        timeOpen: true,
        timeClose: true,
        distance: true,
        rating: true,
        campus: true,
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            name: true
          }
        },
        paymentMethods: {
          select: {
            name: true,
          }
        },
        platforms: {
          select: {
            name: true
          }
        }
      }
    })

    return { dataAllTempatMakan, categoryArray, priceArray, platformArray, paymentArray, searchString }
  }

  // Create tempat makan
  async createTempatMakan(dto: TempatMakanDto) {
    // Formatting category data
    const categoriesArray = dto.category ? dto.category.split(';') : undefined
    let categoryData
    if (categoriesArray) {
      categoryData = []
      categoriesArray.map((category: string) => {
        categoryData.push({
          name: category.trim().toLowerCase()
        })
      })
    }

    // Formatting platform data
    const platformsArray = dto.platform ? dto.platform.split(';') : undefined
    let platformData
    if (platformsArray) {
      platformData = []
      platformsArray.map((platform: string) => {
        platformData.push({
          name: platform.trim().toLowerCase()
        })
      })
    }

    // Formatting paymentMethod data
    const paymentMethodsArray = dto.paymentMethod ? dto.paymentMethod.split(';') : undefined
    let paymentMethodData
    if (paymentMethodsArray) {
      paymentMethodData = []
      paymentMethodsArray.map((paymentMethod: string) => {
        paymentMethodData.push({
          name: paymentMethod.trim().toLowerCase()
        })
      })
    }

    // Save tmepat makan data to the database
    try {
      const resultCreateTempatMakan = await this.prisma.tempatMakan.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          price: dto.price,
          campus: dto.campus,
          address: dto.address,
          latitude: dto.latitude,
          longitude: dto.longitude,
          timeOpen: dto.timeOpen,
          timeClose: dto.timeClose,
          distance: dto.distance,
          rating: dto.rating,
          categories: {
            connect: categoryData
          },
          paymentMethods: {
            connect: paymentMethodData
          },
          platforms: {
            connect: platformData
          },
          userId: 1
        },
        select: {
          name: true,
          description: true,
          imageUrl: true,
          price: true,
          address: true,
          latitude: true,
          longitude: true,
          timeOpen: true,
          timeClose: true,
          distance: true,
          rating: true,
          campus: true,
          createdAt: true,
          updatedAt: true,
          categories: {
            select: {
              name: true
            }
          },
          paymentMethods: {
            select: {
              name: true,
            }
          },
          platforms: {
            select: {
              name: true
            }
          }
        }
      })
      return resultCreateTempatMakan
    } catch (error) {
      return error
    }
    // return categoryData
  }

  // Delete tempat makan
  async deleteTempatMakan() {
    //
  }

}
