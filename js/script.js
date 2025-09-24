document.addEventListener('DOMContentLoaded', () => {
    let jsonData;

    const timeButtons = document.querySelectorAll('.timeframe .btn');
    const getContainers = document.querySelectorAll('.top-color');

    // Get the initial 'weekly' button to set the active state on load
    const weeklyBtn = document.getElementById('weekly');

    const updateUI = (data, timeframe) => {
        const timeframeMap = {
            'daily': 'Yesterday',
            'weekly': 'Last Week',
            'monthly': 'Last Month'
        };
        
        getContainers.forEach(container => {
            // Get the id of the container (e.g., 'work', 'play')
            const containerId = container.querySelector('.container').id;
            
            // Find the corresponding data object
            const activityData = data.find(item => item.title.toLowerCase().replace(' ', '-') === containerId);

            if (activityData) {
                const currentHours = activityData.timeframes[timeframe].current;
                const previousHours = activityData.timeframes[timeframe].previous;
                const timeframeLabel = timeframeMap[timeframe];

                // Select the h1 and p elements within the current container
                const currentHoursEl = container.querySelector('.duration h1');
                const previousHoursEl = container.querySelector('.duration p');

                // Update the text content
                currentHoursEl.textContent = `${currentHours}hrs`;
                previousHoursEl.textContent = `${timeframeLabel} - ${previousHours}hrs`;
            }
        });
    };

    const setActiveButton = (selectedButton) => {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        selectedButton.classList.add('active');
    };

    // Add event listeners to each time button
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const timeframe = button.id;
            setActiveButton(button);
            if (jsonData) {
                updateUI(jsonData, timeframe);
            }
        });
    });

    // Fetch the JSON data and initialize the UI
    fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            jsonData = data;
            // Initialize the UI with 'weekly' data on page load
            updateUI(jsonData, 'weekly');
            setActiveButton(weeklyBtn);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});