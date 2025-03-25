import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Verifica se a rota está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic',
      [context.getHandler(), context.getClass()],
    );

    // Se for uma rota pública, permite o acesso sem autenticação
    if (isPublic) {
      return true;
    }

    // Caso contrário, aplica a autenticação JWT padrão
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Se houver erro ou nenhum usuário for encontrado, lança uma exceção de não autorizado
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }
} 