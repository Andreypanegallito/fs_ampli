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
    const [weather1, setWeather1] = useState<WeatherRecord | null>(null);
    const [weather2, setWeather2] = useState<WeatherRecord | null>(null);
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
            '["Mist"]': " Névoa",
        };
        return translations[description] || description;
    };

    const setComparing = (record: WeatherRecord) => {
        if (weather1 == null && weather2 != record) {
            setWeather1(record);
            return;
        } else if (weather1 != null && weather1 == record) {
            setWeather1(null);
            return;
        }

        if (weather2 == null && weather1 != record) {
            setWeather2(record);
            return;
        } else if (weather2 != null && weather2 == record) {
            setWeather2(null);
            return;
        }

        alert("Já tem duas previsões do tempo sendo comparadas");
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
                                                        <button
                                                            onClick={() =>
                                                                setComparing(
                                                                    record
                                                                )
                                                            }
                                                        >
                                                            {weather1 ===
                                                                record ||
                                                            weather2 === record
                                                                ? " Tirar comparação"
                                                                : " Comparar"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {(weather1 || weather2) && (
                                    <div className=" contents content-comparison bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                                        <h2>Comparação de Previsão do Tempo</h2>
                                        <div className="content">
                                            {weather1 && (
                                                <div className="weather-info">
                                                    <h3>
                                                        Cidade 1:{" "}
                                                        {weather1.city}
                                                    </h3>
                                                    <p>
                                                        Hora da Observação:{" "}
                                                        {formatDate(
                                                            weather1.created_at
                                                        )}{" "}
                                                        {
                                                            weather1.observation_time
                                                        }
                                                    </p>
                                                    <p>
                                                        Temperatura:{" "}
                                                        {weather1.temperature}°C
                                                    </p>
                                                    <p>
                                                        Descrição:
                                                        {translateWeatherDescription(
                                                            weather1.weather_descriptions
                                                        )}
                                                    </p>
                                                    <p>
                                                        Velocidade do Vento:{" "}
                                                        {weather1.wind_speed}{" "}
                                                        km/h
                                                    </p>
                                                    <p>
                                                        Direção do Vento:{" "}
                                                        {weather1.wind_dir} (
                                                        {weather1.wind_degree}°)
                                                    </p>
                                                    <p>
                                                        Pressão:{" "}
                                                        {weather1.pressure} hPa
                                                    </p>
                                                    <p>
                                                        Precipitação:{" "}
                                                        {weather1.precip} mm
                                                    </p>
                                                    <p>
                                                        Umidade:{" "}
                                                        {weather1.humidity}%
                                                    </p>
                                                    <p>
                                                        Cobertura de Nuvens:{" "}
                                                        {weather1.cloudcover}%
                                                    </p>
                                                    <p>
                                                        Sensação Térmica:{" "}
                                                        {weather1.feelslike}°C
                                                    </p>
                                                    <p>
                                                        Índice UV:{" "}
                                                        {weather1.uv_index}
                                                    </p>
                                                    <p>
                                                        Visibilidade:{" "}
                                                        {weather1.visibility} km
                                                    </p>
                                                    <p>
                                                        É Dia:
                                                        {weather1.is_day ===
                                                        "yes"
                                                            ? " Sim"
                                                            : " Não"}
                                                    </p>
                                                </div>
                                            )}
                                            {weather2 && (
                                                <div className="weather-info">
                                                    <h3>
                                                        Cidade 2:{" "}
                                                        {weather2.city}
                                                    </h3>
                                                    <p>
                                                        Hora da Observação:{" "}
                                                        {formatDate(
                                                            weather2.created_at
                                                        )}{" "}
                                                        {
                                                            weather2.observation_time
                                                        }
                                                    </p>
                                                    <p>
                                                        Temperatura:{" "}
                                                        {weather2.temperature}°C
                                                    </p>
                                                    <p>
                                                        Descrição:
                                                        {translateWeatherDescription(
                                                            weather2.weather_descriptions
                                                        )}
                                                    </p>
                                                    <p>
                                                        Velocidade do Vento:{" "}
                                                        {weather2.wind_speed}{" "}
                                                        km/h
                                                    </p>
                                                    <p>
                                                        Direção do Vento:{" "}
                                                        {weather2.wind_dir} (
                                                        {weather2.wind_degree}°)
                                                    </p>
                                                    <p>
                                                        Pressão:{" "}
                                                        {weather2.pressure} hPa
                                                    </p>{" "}
                                                    <p>
                                                        Precipitação:{" "}
                                                        {weather2.precip} mm
                                                    </p>
                                                    <p>
                                                        Umidade:{" "}
                                                        {weather2.humidity}%
                                                    </p>
                                                    <p>
                                                        Cobertura de Nuvens:{" "}
                                                        {weather2.cloudcover}%
                                                    </p>
                                                    <p>
                                                        Sensação Térmica:{" "}
                                                        {weather2.feelslike}°C
                                                    </p>
                                                    <p>
                                                        Índice UV:{" "}
                                                        {weather2.uv_index}
                                                    </p>
                                                    <p>
                                                        Visibilidade:{" "}
                                                        {weather2.visibility} km
                                                    </p>
                                                    <p>
                                                        É Dia:{" "}
                                                        {weather2.is_day ===
                                                        "yes"
                                                            ? "Sim"
                                                            : "Não"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
