# Estágio de build
FROM node:18-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar arquivos do projeto
COPY . .

# Criar build de produção
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar build do React para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Adicionar configuração personalizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]