import {
  Controller,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { ClienteService } from './cliente.service';
import { TipoConta } from 'src/enums/tipo-conta.enum';

@Controller('clientes')
export class ClienteController {
  constructor(
    // @Inject(forwardRef(() => ContaService))
    private readonly clienteService: ClienteService,
  ) {}

  @Post('cadastrar')
  cadastrarCliente(
    @Body('nomeCompleto') nomeCompleto: string,
    @Body('endereco') endereco: string,
    @Body('telefone') telefone: string,
    @Body('rendaSalarial') rendaSalarial: number,
    @Body('gerenteID') gerenteID: string,
  ) {
    try {
      const cliente = this.clienteService.cadastrarCliente(
        nomeCompleto,
        endereco,
        telefone,
        rendaSalarial,
        gerenteID,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Cliente cadastrado com sucesso',
        data: cliente,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  listarClientes() {
    const clientes = this.clienteService.listarClientes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Clientes retornados com sucesso',
      data: clientes,
    };
  }

  @Get(':id')
  obterCliente(@Param('id') id: string) {
    try {
      const cliente = this.clienteService.obterCliente(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cliente retornado com sucesso',
        data: cliente,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/:tipoConta')
  abrirConta(@Param('id') id: string, @Param('tipoConta') tipo: TipoConta) {
    try {
      this.clienteService.adicionarContaAoCliente(tipo, id);
      return {
        statusCode: HttpStatus.CREATED,
        message: `Conta ${tipo} criada com sucesso`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //mudarTipoConta
  @Put('mudarconta/:contaID')
  mudarTipoConta(
    @Param('contaID') contaID: string,
    @Body('novoTipo') novoTipo: TipoConta,
  ) {
    //adicionar verificação depois para ver se o cliente tem renda menor que 500 para fazer a mudança
    try {
      this.clienteService.mudarTipoConta(contaID, novoTipo);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `Tipo da conta alterado com sucesso`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //fecharConta do cliente.servuce
  @Delete('excluir/:contaID')
  fecharConta(@Param('contaID') contaID: string) {
    try {
      this.clienteService.fecharConta(contaID);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `Conta fechada com sucesso`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':clienteID/contas')
  listarContasDoCliente(@Param('clienteID') clienteID: string) {
    try {
      const contas = this.clienteService.listarContasDoCliente(clienteID);
      return {
        statusCode: HttpStatus.OK,
        message: `Contas do cliente retornadas com sucesso`,
        data: contas,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

// @Put(':id/mudar')
// mudarTipoConta(
//   @Param('id') id: string,
//   @Body('contaID') contaID: string,
//   @Body('novoTipo') novoTipo: TipoConta,
// ) {
//   try {
//     const cliente = this.clienteService.obterCliente(id);
//     if (!cliente) {
//       throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
//     }

//     const conta = this.clienteContaService.contas.find(
//       (c) => c.id == contaID,
//     );

//     if (!conta) {
//       throw new HttpException(
//         'Conta não encontrada para o cliente',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     this.clienteContaService.mudarTipoConta(conta, novoTipo);

//     return {
//       statusCode: HttpStatus.OK,
//       message: 'Mudança de conta feita com sucesso',
//     };
//   } catch (error) {
//     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//   }
// }

// @Delete(':id/excluir/:contaID')
// fecharConta(@Param('id') id: string, @Param('contaID') contaID: string) {
//   try {
//     const cliente = this.clienteService.obterCliente(id);
//     if (!cliente) {
//       throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
//     }

//     const conta = this.clienteContaService.contas.find(
//       (c) => c.id == contaID,
//     );

//     if (!conta) {
//       throw new HttpException(
//         'Conta não encontrada para o cliente',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     this.clienteContaService.fecharConta(conta);

//     return {
//       statusCode: HttpStatus.NO_CONTENT,
//       message: 'Conta fechada com sucesso',
//     };
//   } catch (error) {
//     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
//   }
// }
