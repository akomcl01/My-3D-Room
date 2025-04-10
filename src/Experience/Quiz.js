export default class Quiz
{
    constructor()
    {
        this.element = document.createElement('div')
        this.element.className = 'quiz'
        this.element.style.cssText = `
            background: white;
            color: black;
            padding: 30px;
            border-radius: 15px;
            font-family: 'Roboto', sans-serif;
            max-width: 800px;
            width: 90%;
        `

        this.currentStep = 1
        this.answers = {}

        this.setHTML()
        this.setEventListeners()
    }

    setHTML()
    {
        this.element.innerHTML = `
            <div class="quiz-header">
                <h2>AI Agent Customization Quiz</h2>
            </div>
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${(this.currentStep / 3) * 100}%"></div>
                </div>
                <span>Step ${this.currentStep} of 3</span>
            </div>
            <div class="quiz-content">
                ${this.getStepContent()}
            </div>
            <div class="quiz-navigation">
                ${this.currentStep > 1 ? '<button class="prev-step">Previous</button>' : '<div></div>'}
                <button class="next-step">${this.currentStep === 3 ? 'Create your agent' : 'Next'}</button>
            </div>
        `

        // Add styles
        const style = document.createElement('style')
        style.textContent = `
            .quiz-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .quiz-header h2 {
                margin: 0;
                color: #ff6700;
            }
            .quiz-progress {
                margin-bottom: 20px;
            }
            .progress-bar {
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
                margin-bottom: 10px;
            }
            .progress {
                height: 100%;
                background: #ff6700;
                border-radius: 2px;
                transition: width 0.3s;
            }
            .quiz-content {
                margin-bottom: 20px;
            }
            .quiz-navigation {
                display: flex;
                justify-content: space-between;
            }
            .quiz-navigation button {
                background: #ff6700;
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .quiz-navigation button:hover {
                background: #ff8533;
            }
            .question {
                margin-bottom: 20px;
            }
            .question h3 {
                margin-bottom: 10px;
                color: #ff6700;
            }
            .options {
                display: grid;
                gap: 10px;
            }
            .option {
                background: rgba(0, 0, 0, 0.05);
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .option:hover {
                background: rgba(0, 0, 0, 0.1);
            }
            .option.selected {
                background: rgba(255, 103, 0, 0.1);
                border: 1px solid #ff6700;
            }
        `
        document.head.appendChild(style)

        // Re-add event listeners after updating HTML
        this.setEventListeners()
    }

    getStepContent()
    {
        switch(this.currentStep) {
            case 1:
                return `
                    <div class="question">
                        <h3>Choose your agent's color theme</h3>
                        <div class="options">
                            <div class="option" data-value="blue">Blue - Analytical</div>
                            <div class="option" data-value="red">Red - Aggressive</div>
                            <div class="option" data-value="green">Green - Balanced</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Select preferred sports league</h3>
                        <div class="options">
                            <div class="option" data-value="nfl">NFL</div>
                            <div class="option" data-value="nba">NBA</div>
                            <div class="option" data-value="mlb">MLB</div>
                            <div class="option" data-value="soccer">Soccer</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Choose betting types</h3>
                        <div class="options">
                            <div class="option" data-value="spread">Point Spread</div>
                            <div class="option" data-value="moneyline">Moneyline</div>
                            <div class="option" data-value="overunder">Over/Under</div>
                            <div class="option" data-value="props">Player Props</div>
                        </div>
                    </div>
                `
            case 2:
                return `
                    <div class="question">
                        <h3>What type of fan is your agent?</h3>
                        <div class="options">
                            <div class="option" data-value="analyst">Data Analyst</div>
                            <div class="option" data-value="enthusiast">Sports Enthusiast</div>
                            <div class="option" data-value="strategist">Strategic Thinker</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Select preferred news sources</h3>
                        <div class="options">
                            <div class="option" data-value="espn">ESPN</div>
                            <div class="option" data-value="stats">Sports Stats</div>
                            <div class="option" data-value="social">Social Media</div>
                            <div class="option" data-value="experts">Expert Analysis</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Choose influencers to follow</h3>
                        <div class="options">
                            <div class="option" data-value="analysts">Sports Analysts</div>
                            <div class="option" data-value="players">Players</div>
                            <div class="option" data-value="coaches">Coaches</div>
                            <div class="option" data-value="fans">Fan Communities</div>
                        </div>
                    </div>
                `
            case 3:
                return `
                    <div class="question">
                        <h3>How does your agent determine winners?</h3>
                        <div class="options">
                            <div class="option" data-value="stats">Pure Statistics</div>
                            <div class="option" data-value="trends">Trend Analysis</div>
                            <div class="option" data-value="hybrid">Hybrid Approach</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Select favorite teams</h3>
                        <div class="options">
                            <div class="option" data-value="top">Top Performers</div>
                            <div class="option" data-value="underdogs">Underdogs</div>
                            <div class="option" data-value="balanced">Balanced Mix</div>
                        </div>
                    </div>
                    <div class="question">
                        <h3>Agent's view on luck</h3>
                        <div class="options">
                            <div class="option" data-value="none">No Luck Factor</div>
                            <div class="option" data-value="some">Some Luck Involved</div>
                            <div class="option" data-value="significant">Significant Luck Factor</div>
                        </div>
                    </div>
                `
        }
    }

    setEventListeners()
    {
        // Option selection
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('option')) {
                const question = e.target.parentElement
                const options = question.querySelectorAll('.option')
                options.forEach(opt => opt.classList.remove('selected'))
                e.target.classList.add('selected')
            }
        })

        // Navigation buttons
        const nextButton = this.element.querySelector('.next-step')
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentStep < 3) {
                    this.currentStep++
                    this.setHTML()
                } else {
                    this.finishQuiz()
                }
            })
        }

        const prevButton = this.element.querySelector('.prev-step')
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentStep > 1) {
                    this.currentStep--
                    this.setHTML()
                }
            })
        }
    }

    finishQuiz()
    {
        // Collect all selected answers
        const questions = this.element.querySelectorAll('.question')
        questions.forEach(question => {
            const selectedOption = question.querySelector('.option.selected')
            if (selectedOption) {
                const questionText = question.querySelector('h3').textContent
                this.answers[questionText] = selectedOption.dataset.value
            }
        })

        // Here you can handle the collected answers
        console.log('Quiz completed with answers:', this.answers)
    }
} 