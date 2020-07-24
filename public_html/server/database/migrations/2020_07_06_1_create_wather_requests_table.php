<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatewatherRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('wather_requests', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('code',100)->nullable($value = true);
          $table->integer('quantity')->nullable($value = true);
          $table->boolean('activo')->nullable($value = true);
          $table->unsignedInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('wather_requests');
    }
}