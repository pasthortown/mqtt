<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class watherRequest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'code','quantity','activo',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function User()
    {
       return $this->hasOne('App\User');
    }

}