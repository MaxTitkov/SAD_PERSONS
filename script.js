document.addEventListener('DOMContentLoaded', () => {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const progressBar = document.querySelector('progress');
    let currentIndex = 0;
    let totalScore = 0;
    const answers = [];

    // Функция обновления карусели
    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.toggle('is-active', index === currentIndex);
        });
        progressBar.value = (currentIndex / (carouselItems.length - 1)) * 100;
    }

    // Обработка ответа
    function handleAnswer(score) {
        answers[currentIndex] = score;
        totalScore += parseInt(score, 10);
        currentIndex++;

        if (currentIndex < carouselItems.length) {
            updateCarousel();
        } else {
            showResults();
        }
    }

    // Показ результатов
    function showResults() {
        document.querySelector('.carousel').style.display = 'none';
        progressBar.style.display = 'none';
        document.getElementById('results').style.display = 'block';

        // Показываем общий балл
        document.getElementById('total-score').textContent = `Общий балл: ${totalScore}`;

        // Генерация отчета с ответами
        const summary = document.getElementById('answers-summary');
        summary.innerHTML = ''; // Очищаем предыдущий результат, если он был

        const questions = document.querySelectorAll('.question');
        answers.forEach((answer, index) => {
            const questionText = questions[index].textContent;
            const answerText = answer === '1' ? 'Да' : 'Нет';

            const answerElement = document.createElement('p');
            answerElement.textContent = `${questionText}: Ответ - ${answerText}`;
            summary.appendChild(answerElement);
        });
    }

    // Копирование отчета
    document.getElementById('copy-report').addEventListener('click', () => {
        const totalScoreText = document.getElementById('total-score').textContent;
        
        // Генерируем текст отчета с заголовком, общим баллом и ответами
        let report = `--------\nSAD PERSONS Scale\n\n`; // Заголовок
        report += `${totalScoreText}\n\n`; // Добавляем общий балл и пустую строку

        // Добавляем ответы на вопросы
        const summary = document.querySelectorAll('#answers-summary p');
        summary.forEach(p => {
            report += `${p.textContent}\n`; // Добавляем каждый пункт с новой строки
        });

        // Копируем отчет в буфер обмена
        navigator.clipboard.writeText(report).then(() => {
            //alert('Отчет успешно скопирован в буфер обмена!');
        }).catch(err => {
            alert('Ошибка при копировании отчета: ' + err);
        });
    });
    // Функция сброса теста
    function resetTest() {
        // Сбрасываем все значения
        currentIndex = 0;
        totalScore = 0;
        answers.length = 0; // Очищаем массив ответов

        // Скрываем результаты и показываем карусель
        document.getElementById('results').style.display = 'none';
        document.querySelector('.carousel').style.display = 'flex';
        progressBar.style.display = 'block';
        progressBar.value = 0;

        // Возвращаемся к первому вопросу
        updateCarousel();
    };
    // Кнопка "Вернуться назад" для сброса теста
    document.getElementById('reset-test').addEventListener('click', resetTest);

    // Инициализация первого вопроса
    updateCarousel();

    // Обработка кликов по кнопкам ответов
    const buttons = document.querySelectorAll('.button[data-answer]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.getAttribute('data-answer');
            handleAnswer(answer);
        });
    });

    // Инициализация первого вопроса
    updateCarousel();
});