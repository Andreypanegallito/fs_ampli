<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'city',
        'observation_time',
        'temperature',
        'weather_code',
        'weather_icons',
        'weather_descriptions',
        'wind_speed',
        'wind_degree',
        'wind_dir',
        'pressure',
        'precip',
        'humidity',
        'cloudcover',
        'feelslike',
        'uv_index',
        'visibility',
        'is_day'
    ];
    protected $casts = [
        'weather_icons' => 'array',
        'weather_descriptions' => 'array',
    ];
}
