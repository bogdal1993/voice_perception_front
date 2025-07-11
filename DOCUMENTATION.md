# Документация проекта Voice Perception Web (vpweb)

Этот проект представляет собой веб-приложение, созданное с использованием Create React App, предназначенное для управления и анализа данных о звонках. Оно предоставляет функциональность для поиска звонков, визуализации данных с помощью графиков, анализа текста, загрузки файлов и редактирования тегов.

## Оглавление
1. [Обзор проекта](#обзор-проекта)
2. [Возможности](#возможности)
3. [Технический стек](#технический-стек)
4. [Структура проекта](#структура-проекта)
5. [Ключевые компоненты](#ключевые-компоненты)
6. [Управление состоянием](#управление-состоянием)
7. [Интеграция с API](#интеграция-с-api)
8. [Запуск проекта](#запуск-проекта)
9. [Модели данных](#модели-данных)
10. [Примечания по разработке](#примечания-по-разработке)
11. [Будущие улучшения](#будущие-улучшения)

## Обзор проекта

Проект `vpweb` - это клиентское веб-приложение, разработанное на React, которое взаимодействует с бэкендом для обработки и отображения данных о звонках. Основная цель приложения - предоставить пользователям удобный интерфейс для анализа больших объемов голосовых данных.

## Возможности

-   **Поиск звонков**: Позволяет пользователям искать звонки по различным фильтрам, таким как диапазон дат, звонящий, вызываемый и конкретные слова в разговоре.
-   **Анализ графиков**: Предоставляет визуальное представление данных о звонках с помощью различных типов графиков (круговые, линейные, облако тегов) с настраиваемыми фильтрами.
-   **Текстовый поиск**: Включает текстовый поиск внутри звонков, поддерживающий несколько ключевых слов как для звонящего, так и для вызываемого.
-   **Загрузка файлов**: Позволяет пользователям загружать файлы звонков с соответствующими метаданными.
-   **Редактор тегов**: Предоставляет интерфейс для управления тегами, связанными со звонками, включая названия тегов, спикеров и связанные тексты.

## Технический стек

-   **Фронтенд**:
    -   React: Основная библиотека для построения пользовательского интерфейса.
    -   React Router DOM: Для маршрутизации в приложении.
    -   Context API: Для глобального управления состоянием.
    -   Chart.js: Для рендеринга графиков.
    -   React Grid Layout: Для адаптивного размещения элементов сетки на страницах с графиками.
    -   react-datepicker: Для выбора дат.
    -   TypeScript: Для статической типизации.
    -   CSS Modules: Для компонентно-специфичных стилей.
    -   Ionicons: Для иконок.
-   **Бэкенд**: FastAPI.
-   **Управление пакетами**: npm.

## Структура проекта

-   `public/`: Статические файлы, такие как `index.html`, иконки и манифест.
-   `src/`: Основной исходный код приложения.
    -   `src/App.tsx`: Корневой компонент приложения, содержащий маршрутизацию.
    -   `src/index.tsx`: Точка входа в приложение, рендеринг корневого компонента и провайдеров контекста.
    -   `src/index.css`: Глобальные стили.
    -   `src/models.ts`: TypeScript-интерфейсы для моделей данных.
    -   `src/react-app-env.d.ts`: Файл объявлений типов для Create React App.
    -   `src/setupTests.ts`: Файл настройки тестов.
    -   `src/wavesurfer.js`: Обработка аудиоволн.
    -   `src/components/`: Переиспользуемые UI-компоненты.
        -   `src/components/ApiKeyModal.tsx`: Модальное окно для ввода API-ключа.
        -   `src/components/CallCard.tsx`: Компонент для отображения информации о звонке.
        -   `src/components/ChartComponent.tsx`: Базовый компонент для отображения различных типов графиков.
        -   `src/components/menu.tsx`: Компонент меню.
        -   `src/components/Navigation.tsx`: Компонент боковой навигации.
        -   `src/components/Table.tsx`: Компонент таблицы.
        -   `src/components/UseEffectExample.tsx`: Пример использования `useEffect`.
        -   `src/components/chartsComponents/`: Компоненты для конкретных типов графиков.
            -   `src/components/chartsComponents/lineComponent.tsx`: Компонент линейного графика.
            -   `src/components/chartsComponents/pieComponent.tsx`: Компонент кругового графика.
            -   `src/components/chartsComponents/tagComponent.tsx`: Компонент облака тегов.
    -   `src/context/`: Провайдеры контекста для управления глобальным состоянием.
        -   `src/context/chartsContext.tsx`: Контекст для управления данными и состоянием графиков.
        -   `src/context/navContext.tsx`: Контекст для управления состоянием навигационной панели.
    -   `src/data/`: Статические данные и конфигурация API.
        -   `src/data/chartsData.ts`: Данные для инициализации графиков и конфигурация API-эндпоинтов.
        -   `src/data/menus.ts`: Данные для элементов меню навигации.
    -   `src/pages/`: Компоненты страниц для различных представлений.
        -   `src/pages/ChartContent.tsx`: Страница для отображения графиков.
        -   `src/pages/MainContent.tsx`: Основная страница с поиском звонков и таблицей.
        -   `src/pages/SendFileForm.tsx`: Страница для загрузки файлов.
        -   `src/pages/TagEditor.tsx`: Страница для редактирования тегов.
        -   `src/pages/TextSearchPage.tsx`: Страница для текстового поиска.
-   `openai-service/`: Отдельный сервис для работы с OpenAI.
-   `openai-wrapper-service/`: Обертка для сервиса OpenAI.
-   `test/`: Каталог для тестов.
-   `test-app/`: .
-   `test-results/`: .

## Ключевые компоненты

### `Navigation` (`src/components/Navigation.tsx`)
Предоставляет боковую навигацию со ссылками на различные разделы приложения. Использует `NavigationContext` для управления состоянием открытия/закрытия.

### `CallCard` (`src/components/CallCard.tsx`)
Отображает подробную информацию о звонке, включая метаданные, теги и транскрипцию. Поддерживает воспроизведение аудио и визуализацию анализа эмоций.

### `ChartComponent` (`src/components/ChartComponent.tsx`)
Базовый компонент для графиков, поддерживающий различные типы (`PieComponent`, `LineComponent`, `TagComponent`). Интегрируется с Chart.js для рендеринга визуализаций.

### `MainContent` (`src/pages/MainContent.tsx`)
Основное представление, отображающее список звонков с фильтрами по диапазону дат, звонящему, вызываемому и словам. Поддерживает пагинацию и просмотр деталей звонка.

### `TextSearchPage` (`src/pages/TextSearchPage.tsx`)
Позволяет выполнять текстовый поиск внутри звонков с использованием нескольких ключевых слов.

### `SendFileForm` (`src/pages/SendFileForm.tsx`)
Форма для загрузки файлов звонков с соответствующими метаданными.

### `TagEditor` (`src/pages/TagEditor.tsx`)
Интерфейс для управления тегами, связанными со звонками, включая названия тегов, спикеров и связанные тексты.

## Управление состоянием

-   **`NavigationContext`** (`src/context/navContext.tsx`): Управляет состоянием боковой навигации (открыта/закрыта).
-   **`ChartContext`** (`src/context/chartsContext.tsx`): Управляет конфигурациями графиков и данными. Загружает и сохраняет данные графиков в `localStorage`. Предоставляет функции для добавления, удаления, обновления, установки всех графиков, удаления по имени и дублирования графиков.

## Интеграция с API

-   Эндпоинты бэкенд-API, предположительно, настраиваются в `src/data/chartsData.ts`.
-   API поддерживают поиск звонков, управление тегами и загрузку файлов.

## Запуск проекта

В директории проекта вы можете выполнить:

-   `npm start`: Запускает приложение в режиме разработки. Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере. Страница будет перезагружаться при внесении изменений.
-   `npm test`: Запускает тестовый раннер в интерактивном режиме просмотра.
-   `npm run build`: Собирает приложение для продакшена в папку `build`.

## Модели данных (`src/models.ts`)

-   `IMenu`: Интерфейс для элементов меню навигации.
    -   `name`: Название меню.
    -   `ion`: Иконка Ionicons.
    -   `url`: URL-адрес для маршрутизации.
-   `IChart<T>`: Интерфейс для конфигурации графика.
    -   `type`: Тип компонента графика ('PieComponent', 'TagComponent', 'LineComponent').
    -   `filter`: Объект фильтра, специфичный для типа графика.
    -   `datasource`: Источник данных для графика.
    -   `span`: Позиция и размер графика в сетке (x, y, w, h, minW, maxW, minH, maxH).
    -   `chartname`: Уникальное имя графика.
-   `IFilterBase`: Базовый интерфейс для фильтров.
    -   `startDate`: Начальная дата.
    -   `endDate`: Конечная дата.
    -   `caller`: Звонящий.
    -   `callee`: Вызываемый.
    -   `spk`: Спикер.
-   `IFilterCount`: Интерфейс для фильтров, используемых в графиках подсчета.
    -   `startDate`, `endDate`, `caller`, `callee`: Как в `IFilterBase`.
    -   `sampling`: Параметр выборки.
-   `IFilterTagsCloud`: Интерфейс для фильтров, используемых в облаке тегов.
    -   `startDate`, `endDate`, `caller`, `callee`, `spk`: Как в `IFilterBase`.
    -   `limit`: Ограничение количества тегов.
    -   `part`: Массив частей (возможно, для фильтрации по частям речи или другим сегментам).

## Примечания по разработке

-   Проект использует TypeScript для обеспечения статической типизации, что повышает надежность и поддерживаемость кода.
-   CSS-модули используются для инкапсуляции стилей, предотвращая конфликты и улучшая модульность.
-   Chart.js интегрирован для создания интерактивных и настраиваемых графиков.
-   React Grid Layout используется для создания гибких и адаптивных макетов, позволяя пользователям изменять размер и перемещать графики на странице.

## Будущие улучшения

-   Добавить модульные тесты для компонентов и взаимодействий с API.
-   Реализовать больше типов графиков и опций визуализации.
-   Расширить управление тегами с помощью расширенных возможностей фильтрации и поиска.
-   Улучшить функции доступности по всему приложению.

Для получения более подробной информации обращайтесь к соответствующим файлам компонентов и контекста.
