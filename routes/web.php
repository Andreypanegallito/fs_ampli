<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WeatherController; // Adicione essa linha
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Adicione estas rotas para o controlador WeatherController
Route::get('/weather', [WeatherController::class, 'index'])->name('weather.index');
Route::post('/weather/fetch', [WeatherController::class, 'fetchWeather'])->name('weather.fetch');
Route::post('/weather/save', [WeatherController::class, 'saveWeather'])->name('weather.save');
Route::post('/weather/history', [WeatherController::class, 'getHistory'])->name('weather.history');


require __DIR__ . '/auth.php';
