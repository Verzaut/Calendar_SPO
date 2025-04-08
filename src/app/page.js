"use client";
import Link from "next/link";
import { useState } from "react";

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sleepHours, setSleepHours] = useState("");
  const [activityStartTime, setActivityStartTime] = useState("");
  const [activityEndTime, setActivityEndTime] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activities, setActivities] = useState({});
  const [showLegend, setShowLegend] = useState(false);

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  const calculateActivityHours = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return (end - start) / (1000 * 60 * 60);
  };

  const getTotalActivityHoursForDay = (day) => {
    const dayActivities = activities[`${day}-${currentMonth}-${currentYear}`]?.activities || [];
    return dayActivities.reduce((total, activity) => {
      return total + calculateActivityHours(activity.startTime, activity.endTime);
    }, 0);
  };

  const saveSleepData = () => {
    setActivities((prev) => ({
      ...prev,
      [`${selectedDate}-${currentMonth}-${currentYear}`]: {
        ...prev[`${selectedDate}-${currentMonth}-${currentYear}`],
        sleep: sleepHours
      },
    }));
    setSleepHours("");
  };

  const saveActivity = () => {
    setActivities((prev) => {
      const dateKey = `${selectedDate}-${currentMonth}-${currentYear}`;
      const updatedActivities = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          activities: [
            ...(prev[dateKey]?.activities || []),
            { startTime: activityStartTime, endTime: activityEndTime, description: activityDescription },
          ],
        },
      };
      return updatedActivities;
    });
    setActivityStartTime("");
    setActivityEndTime("");
    setActivityDescription("");
  };

  const deleteActivity = (index) => {
    setActivities((prevActivities) => {
      const dateKey = `${selectedDate}-${currentMonth}-${currentYear}`;
      const updatedActivities = prevActivities[dateKey].activities.filter((_, i) => i !== index);
      return { ...prevActivities, [dateKey]: { ...prevActivities[dateKey], activities: updatedActivities } };
    });
  };

  const getDayColor = (day) => {
    const sleep = activities[`${day}-${currentMonth}-${currentYear}`]?.sleep || 0;
    if (sleep >= 7) return "bg-green-500 text-white";
    if (sleep >= 5) return "bg-yellow-500 text-black";
    if (sleep > 0) return "bg-red-500 text-white";
    return "bg-gray-200";
  };

  const openModal = (day) => {
    setSelectedDate(day);
    setSleepHours(activities[`${day}-${currentMonth}-${currentYear}`]?.sleep || "");
    setActivityStartTime("");
    setActivityEndTime("");
    setActivityDescription("");
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  return (
    <main className="flex min-h-screen bg-gray-900 text-white">
      {/* Основной контент */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">📅 Ваш календарь активности и сна</h1>


        <div className="flex items-center gap-4 mb-4 text-xl">
          <button
            onClick={() => setCurrentYear((y) => y - 1)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            ◀️
          </button>
          <span className="font-bold">{currentYear}</span>
          <button
            onClick={() => setCurrentYear((y) => y + 1)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            ▶️
          </button>
        </div>

        <select
          className="mb-6 p-2 border border-gray-600 bg-gray-800 rounded"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index} className="text-black">
              {month}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day}
              className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition ${getDayColor(day)}`}
              onClick={() => openModal(day)}
            >
              {day}
            </div>
          ))}
        </div>

        <button
          className="mt-6 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          onClick={toggleLegend}
        >
          Показать легенду
        </button>

        {showLegend && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-96">
              <h2 className="text-2xl mb-4">Легенда</h2>
              <p className="mb-2">🟢 Хороший сон (7+ часов)</p>
              <p className="mb-2">🟡 Средний сон (5-6 часов)</p>
              <p className="mb-2">🔴 Плохой сон (менее 5 часов)</p>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded transition"
                onClick={toggleLegend}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-96">
              <h2 className="text-2xl mb-4">{`${selectedDate} ${monthNames[currentMonth]} ${currentYear}`}</h2>

              <div className="mb-4">
                <p><strong>Часы сна: </strong>{activities[`${selectedDate}-${currentMonth}-${currentYear}`]?.sleep || 0} часов</p>
                <p><strong>Часы активности: </strong>{getTotalActivityHoursForDay(selectedDate).toFixed(2)} часов</p>
              </div>

              <label className="block mb-2 text-lg">
                Часы сна:
                <input
                  type="number"
                  min="0"
                  max="24"
                  className="ml-2 border p-1 bg-gray-700 text-white rounded"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </label>




              <label className="block mb-2 text-lg">
                Время (с):
                <input
                  type="time"
                  className="ml-2 border p-1 bg-gray-700 text-white rounded"
                  value={activityStartTime}
                  onChange={(e) => setActivityStartTime(e.target.value)}
                />
              </label>
              <label className="block mb-2 text-lg">
                Время (по):
                <input
                  type="time"
                  className="ml-2 border p-1 bg-gray-700 text-white rounded"
                  value={activityEndTime}
                  onChange={(e) => setActivityEndTime(e.target.value)}
                />
              </label>


              <label className="block mb-2 text-lg">
                Описание активности:
                <input
                  type="text"
                  className="ml-2 border p-1 bg-gray-700 text-white rounded"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                />
              </label>

              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded transition"
                  onClick={saveSleepData}
                >
                  Сохранить
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded transition"
                  onClick={saveActivity}
                >
                  Добавить активность
                </button>

                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded transition"
                  onClick={closeModal}
                >
                  Закрыть
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg mb-2">Ваши активности:</h3>
                <ul className="text-left">
                  {activities[`${selectedDate}-${currentMonth}-${currentYear}`]?.activities?.map((activity, index) => (
                    <li key={index} className="mb-2">
                      <div>
                        <strong>С: </strong>{activity.startTime} - <strong>По: </strong>{activity.endTime}
                        <p>{activity.description}</p>
                        <button
                          className="text-yellow-500 hover:text-yellow-400"
                          onClick={() => {
                            const startTime = prompt("Введите новое время начала", activity.startTime);
                            const endTime = prompt("Введите новое время окончания", activity.endTime);
                            const description = prompt("Введите новое описание", activity.description);
                            if (startTime && endTime && description) {
                              setActivities((prev) => {
                                const dateKey = `${selectedDate}-${currentMonth}-${currentYear}`;
                                const updatedActivities = [...prev[dateKey].activities];
                                updatedActivities[index] = { startTime, endTime, description };
                                return { ...prev, [dateKey]: { ...prev[dateKey], activities: updatedActivities } };
                              });
                            }
                          }}
                        >
                          Изменить
                        </button>
                        <button
                          className="ml-2 text-red-500 hover:text-red-400"
                          onClick={() => deleteActivity(index)}
                        >
                          Удалить
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Навигационное меню */}
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/profile" className="block p-2 hover:bg-gray-700 rounded">
              Пользователь
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}