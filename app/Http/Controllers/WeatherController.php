<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\WeatherRecord;

class WeatherController extends Controller
{
    public function index()
    {
        return inertia('Weather/Index');
    }
    public function fetchWeather(Request $request)
    {
        // Lógica para buscar previsão do tempo
        $city = $request->input('city');
        $apiKey = env('WEATHERSTACK_API_KEY');
        $response = Http::get("http://api.weatherstack.com/current", [
            'access_key' => $apiKey,
            'query' => $city,
            'units' => 'm',
        ]);
        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Erro ao buscar dados do tempo.'], 500);
        }
    }
    public function saveWeather(Request $request)
    { {
            $weatherData = $request->input('weather');
            $weatherRecord = new WeatherRecord();
            $weatherRecord->city = $weatherData['city'];
            $weatherRecord->observation_time = $weatherData['observation_time'];
            $weatherRecord->temperature = $weatherData['temperature'];
            $weatherRecord->weather_code = $weatherData['weather_code'];
            $weatherRecord->weather_icons = json_encode($weatherData['weather_icons']);
            $weatherRecord->weather_descriptions = json_encode($weatherData['weather_descriptions']);
            $weatherRecord->wind_speed = $weatherData['wind_speed'];
            $weatherRecord->wind_degree = $weatherData['wind_degree'];
            $weatherRecord->wind_dir = $weatherData['wind_dir'];
            $weatherRecord->pressure = $weatherData['pressure'];
            $weatherRecord->precip = $weatherData['precip'];
            $weatherRecord->humidity = $weatherData['humidity'];
            $weatherRecord->cloudcover = $weatherData['cloudcover'];
            $weatherRecord->feelslike = $weatherData['feelslike'];
            $weatherRecord->uv_index = $weatherData['uv_index'];
            $weatherRecord->visibility = $weatherData['visibility'];
            $weatherRecord->is_day = $weatherData['is_day'];
            $weatherRecord->save();
            return response()->json(['message' => 'Previsão do tempo salva com sucesso!']);
        }
    }

    public function getHistory(Request $request)
    {
        $city = $request->input('city');
        if (empty($city)) {
            // Retorna todos os registros se city estiver vazio
            $history = WeatherRecord::all();
        } else {
            // Usa LIKE para filtrar os registros pela cidade fornecida
            $history = WeatherRecord::where('city', 'LIKE', '%' . $city . '%')->get();
        }

        return response()->json($history);
    }
}
