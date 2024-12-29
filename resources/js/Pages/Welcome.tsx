import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Weather {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
}

export interface WeatherRecord {
    id: number;
    city: string;
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string;
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
    created_at: string;
    updated_at: string;
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [cep, setCep] = useState("");
    const [city, setCity] = useState("");
    const [cityHistory, setCityHistory] = useState("");
    const [weather, setWeather] = useState<Weather | null>(null);
    const [weatherHistory, setWeatherHistory] = useState<WeatherRecord[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const onChangeCep = (e: any) => {
        setCep(e.target.value);
        const valueFormatted = e.target.value.replace(/\D/g, "");
        if (valueFormatted.length === 8) {
            fetchCepData(valueFormatted);
        }
    };

    const fetchCepData = (cep: any) => {
        // Lógica para buscar dados da API de CEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Atualize o campo de cidade com os dados retornados
                setCity(data.localidade);
            })
            .catch((error) => {
                console.error("Erro ao buscar o CEP:", error);
            });
    };

    const fetchWheaterData = () => {
        axios
            .post("/weather/fetch", { city })
            .then((response) => {
                console.log(response);
                console.log(response.data.current);
                setWeather(response.data.current);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do tempo:", error);
            });
    };

    const saveWeatherData = () => {
        axios
            .post("/weather/save", { weather: { ...weather, city } })
            .then((response) => {
                alert(response.data.message);
            })
            .catch((error) => {
                console.error("Erro ao salvar dados do tempo:", error);
            });
    };

    const fetchWeatherHistory = () => {
        console.log(cityHistory);
        setWeatherHistory([]);
        axios
            .post("/weather/history", { city: cityHistory || "" })
            .then((response) => {
                console.log(response);
                setWeatherHistory(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar histórico do tempo:", error);
            });
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return " " + format(date, "dd/MM/yyyy", { locale: ptBR });
    };

    const translateWeatherDescription = (description: string) => {
        const translations: { [key: string]: string } = {
            '["Partly cloudy"]': " Parcialmente nublado",
            '["Clear"]': " Limpo",
            // Adicione outras traduções conforme necessário
        };
        return translations[description] || description;
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="mt-6">
                            <div className="flex content-container ">
                                <div className="contents content-cep bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                                    <h2 className="text-xl font-semibold text-black dark:text-white">
                                        Buscar cidade pelo cep
                                    </h2>

                                    <div className="labels">
                                        <label htmlFor="cep">CEP:</label>
                                        <InputMask
                                            mask="99999-999"
                                            value={cep}
                                            onChange={(e) => onChangeCep(e)}
                                        >
                                            {(inputProps) => (
                                                <input
                                                    {...inputProps}
                                                    className="form-control text-black"
                                                    id="cep"
                                                    placeholder="Informe o CEP"
                                                />
                                            )}
                                        </InputMask>
                                    </div>
                                    <div className="labels">
                                        <label htmlFor="city">Cidade:</label>
                                        <input
                                            type="text"
                                            className="form-control text-black"
                                            id="city"
                                            value={city}
                                            onChange={(e) =>
                                                setCity(e.target.value)
                                            }
                                            placeholder="Informe o nome da cidade"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btns"
                                            onClick={fetchWheaterData}
                                        >
                                            Buscar Informações
                                        </button>
                                    </div>
                                </div>
                                {weather && (
                                    <div className="contents content-weather bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                                        <div className="title ">
                                            <h2 className=" text-xl font-semibold text-black dark:text-white">
                                                Previsão do tempo em {city}
                                                <img
                                                    src={
                                                        weather.weather_icons[0]
                                                    }
                                                    alt="Weather Icon"
                                                    className="img-weather"
                                                />
                                            </h2>
                                        </div>
                                        <div className="content  text-black dark:text-white">
                                            <p>
                                                <strong>
                                                    Hora da Observação:
                                                </strong>
                                                {weather.observation_time}
                                            </p>
                                            <p>
                                                <strong>Temperatura:</strong>
                                                {weather.temperature}°C
                                            </p>
                                            <p>
                                                <strong>Descrição:</strong>
                                                {
                                                    weather
                                                        .weather_descriptions[0]
                                                }
                                            </p>
                                            <p>
                                                <strong>
                                                    Velocidade do Vento:
                                                </strong>
                                                {weather.wind_speed} km/h
                                            </p>
                                            <p>
                                                <strong>
                                                    Direção do Vento:
                                                </strong>
                                                {weather.wind_dir} (
                                                {weather.wind_degree}°)
                                            </p>
                                            <p>
                                                <strong>Pressão: </strong>
                                                {weather.pressure} hPa
                                            </p>
                                            <p>
                                                <strong>Precipitação:</strong>
                                                {weather.precip}mm
                                            </p>
                                            <p>
                                                <strong>Umidade: </strong>
                                                {weather.humidity}%
                                            </p>
                                            <p>
                                                <strong>
                                                    Cobertura de Nuvens:
                                                </strong>
                                                {weather.cloudcover}%
                                            </p>
                                            <p>
                                                <strong>
                                                    Sensação Térmica:
                                                </strong>
                                                {weather.feelslike}°C
                                            </p>
                                            <p>
                                                <strong>Índice UV:</strong>
                                                {weather.uv_index}
                                            </p>
                                            <p>
                                                <strong>Visibilidade:</strong>
                                                {weather.visibility} km
                                            </p>
                                            <p>
                                                <strong>É Dia:</strong>
                                                {weather.is_day === "yes"
                                                    ? "Sim"
                                                    : "Não"}
                                            </p>

                                            <div className="save-weather">
                                                <button
                                                    type="button"
                                                    className="btns"
                                                    onClick={saveWeatherData}
                                                >
                                                    Salvar Informações
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="contents content-history bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                                    <h2 className="text-xl font-semibold text-black dark:text-white">
                                        Históricos de previsão de tempo
                                    </h2>

                                    <div className="labels">
                                        <label htmlFor="city">Cidade:</label>
                                        <input
                                            type="text"
                                            className="form-control text-black"
                                            id="city"
                                            value={cityHistory}
                                            onChange={(e) =>
                                                setCityHistory(e.target.value)
                                            }
                                            placeholder="Informe o nome da cidade"
                                        />
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={fetchWeatherHistory}
                                    >
                                        Carregar Histórico
                                    </button>
                                    <div className="history-list">
                                        {weatherHistory.map((record, index) => (
                                            <div
                                                key={index}
                                                className="history-item"
                                            >
                                                <div
                                                    className="history-header"
                                                    onClick={() =>
                                                        toggleExpand(index)
                                                    }
                                                >
                                                    <h3>
                                                        {record.city} -
                                                        {formatDate(
                                                            record.created_at
                                                        )}
                                                        {expandedIndex === index
                                                            ? " Minimizar"
                                                            : " Expandir"}
                                                    </h3>
                                                </div>
                                                {expandedIndex === index && (
                                                    <div className="history-details">
                                                        <p>
                                                            Data da Observação:
                                                            {
                                                                record.observation_time
                                                            }
                                                        </p>
                                                        <p>
                                                            Temperatura:
                                                            {record.temperature}
                                                            °C
                                                        </p>
                                                        <p>
                                                            Descrição:
                                                            {translateWeatherDescription(
                                                                record.weather_descriptions
                                                            )}
                                                        </p>
                                                        <p>
                                                            Vento:
                                                            {record.wind_speed}
                                                            km/h (
                                                            {record.wind_dir})
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
