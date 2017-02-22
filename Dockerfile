#Nginx on Alpine
FROM nginx:alpine

#Config nginx
COPY nginx.conf /etc/nginx/nginx.conf

#Copy website contents
#COPY public /usr/share/nginx/html
