# Mini Inventory API

Aplikasi mini inventory dan POS sistem. Untuk manajemen penjualan.
Flow sederhana dari aplikasi ini adalah sistem POS sebagai berikut:

1. Menampilkan produk yang ingin dibeli (sudah ada seeder dengan manajemen stock produk
   sekaligus harga jual dan harga grosir untuk mengetahui keuntungan)
2. Membuat order dan memilih produk yang ingin di beli
3. Konfirmasi order dan program ini akan menampilkan keuntungan yang di dapat berdasarkan 
   harga jual dikurangi harga grosirnya

## Deploy Heroku
https://mini-inventory.herokuapp.com

## Project

Project ini menggunakan framework ExpressJs karena aplikasinya sederhana dan ExpressJs
cocok untuk pengembangan aplikasi yang lite, minimalis, dan fleksibel. Awalnya saya ingin
menggunakan NestJs karena requirement DOT Indonesia pakai NestJs, namun untuk project tes
ini saya memilih ExpressJs saja karena minimalis. Tapi saya sudah terbiasa juga dengan
NestJs dengan struktur projectnya yang membagi modul-modul sangat cocok untuk pengembangan
aplikasi skala besar.

Struktur project ini seperti pada umumnya saya menggunakan MVC. Terdapat middlewares
dan functions untuk beberapa fungsi seperti auth dan error handle. Saya juga sudah
membuat migrasi database, seeder, dan test APInya, jadi tinggal jalankan command saja dan
aplikasi ini siap didemokan. 

Untuk .env di sini sengaja saya push ke repository agar mudah saja dalam pengaturannya, 
jadi tidak ribet lagi. Seperti redis, saya menggunakan redislab yang online karena praktis
untuk development, dan sejujurnya saya masih pertama kali pakai redis. Tapi alhamdulillah
lancaar, malah saja dapat ilmu baru ternyata sangat berguna dan mudah penggunaannya.

### Stack Technology

- NodeJs (Requirement DOT Indonesia)
- Express (Karena aplikasi sederhana dan minimalis)
- MySQL (Cuma pada development saja)
- PostgreSQL (Deploy heroku karena gratis :v)
- Redis (Requirement DOT Indonesia)



# Basic Install

1. git clone repository ini
    ```
    https://github.com/fradotech/mini-inventory.git
    ```
2. Install semua dependencies
    ```
      npm i
    ```
3. Buat database MySQnya dulu dalam localhost dengan nama "mini_inventory" (kalau sesuai .env)

4. Jalankan migrasi dan isi seedersnya
    ```
      sequelize db:migrate
      sequelize db:seed:all
    ```
    jika belum install sequelize-cli, install dulu dengan
    ```
      npm i -g --save sequelize-cli
    ```
5. Jalankan aplikasinya dengan
    ```
      npm start
    ```

6. Terakhir, jalankan test APInya dengan
    ```
      npm run test
    ```

    NOTE: Untuk accessToken dalam test harus dipantau, token terbaru saya isi tanggal
    25 Mei dengan expired 7 hari. Akan expired di 32 Juni :v

# Dokumentasi

#### Skema Database
https://dbdiagram.io/d/628c8999f040f104c184d8d3

#### Dokumentasi (Postman)
https://documenter.getpostman.com/view/21031688/Uz59NeXi