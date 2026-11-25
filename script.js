const gameScreen = document.getElementById("gameScreen");
const statusText = document.getElementById("statusText");
const notification = document.getElementById("notification");

let changingScreen = false;
let notificationTimer;

const gameState = {
    scores: {
        kebab: 0,
        builder: 0,
        chaos: 0
    },
    secretsOpened: new Set()
};

const secretMessages = [
    {
        icon: "🏠",
               title: "House update",
        text: "I love seeing how much progress you've made on the house, and I love the man you're becoming. I'm glad I get to be part of it and see you grow. I'm proud of you for how you handle the good days and, especially, for how you keep going on the hard ones."
    },
    {
        icon: "🇬🇧",
        title: "Official complaint",
        text:
            "Your sense of humour is terrible. Luckily for you, " +
            "I find terrible British humour rather entertaining."
    },
    {
        icon: "✈️",
        title: "Delayed delivery",
        text:
            "You are owed one proper birthday reward. Delivery has been " +
            "delayed by approximately one international flight."
    }
];

gameScreen.addEventListener("click", handleGameClick);

function handleGameClick(event) {
    const button = event.target.closest("button");

    if (!button || changingScreen) {
        return;
    }

    if (button.id === "startButton") {
        transitionTo(renderBriefing);
        return;
    }

    const action = button.dataset.action;

    if (action === "accept-mission") {
        transitionTo(renderMissionOne);
    }

    if (action === "mission-one-choice") {
        selectMissionOneChoice(button.dataset.choice);
    }

    if (action === "mission-two") {
        transitionTo(renderMissionTwo);
    }

    if (action === "mission-two-choice") {
        selectMissionTwoChoice(button.dataset.choice);
    }

    if (action === "mission-three") {
        transitionTo(renderMissionThree);
    }

    if (action === "mission-three-choice") {
        selectMissionThreeChoice(button.dataset.choice);
    }

 if (action === "show-results") {
    const victorySound = new Audio("gta-sa-2345mission-passed.mp3");
    victorySound.volume = 0.5;

    const musicWasPlaying =
        birthdayBackgroundMusic && !birthdayBackgroundMusic.paused;

    if (musicWasPlaying) {
        birthdayBackgroundMusic.pause();
    }

    function resumeBackgroundMusic() {
        if (musicWasPlaying) {
            birthdayBackgroundMusic.play().catch(() => {});
        }
    }

    victorySound.addEventListener("ended", resumeBackgroundMusic, { once: true });
    victorySound.play().catch(resumeBackgroundMusic);

    transitionTo(renderResults);
}

    if (action === "show-card") {
        transitionTo(renderMagicCard);
    }

    if (action === "show-secrets") {
        transitionTo(renderSecretMessages);
    }

    if (action === "reveal-secret") {
        revealSecret(button);
    }

    if (action === "show-reward") {
        transitionTo(renderFinalReward);
    }

    if (action === "restart") {
        restartGame();
    }
}

function transitionTo(renderFunction) {
    changingScreen = true;
    gameScreen.classList.add("fade-out");

    window.setTimeout(() => {
        gameScreen.classList.remove("fade-out");
        renderFunction();
        changingScreen = false;

        window.scrollTo({
            top: 0,
            behaviour: "smooth"
        });
    }, 280);
}

function updateStatus(message) {
    statusText.textContent = message;
}

function showNotification(message) {
    window.clearTimeout(notificationTimer);

    notification.textContent = message;
    notification.classList.add("show");

    notificationTimer = window.setTimeout(() => {
        notification.classList.remove("show");
    }, 2200);
}

function addScores(newScores) {
    Object.entries(newScores).forEach(([scoreName, points]) => {
        gameState.scores[scoreName] += points;
    });
}

function renderBriefing() {
    updateStatus("Mission briefing");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Top-secret assignment</p>

            <h2 class="screen-title">
                Welcome,
                <span>Agent Sam</span>
            </h2>

            <p class="mission-copy">
                Another year successfully survived. Your mission is to
                complete three highly scientific challenges, make several
                questionable decisions and unlock your classified birthday
                reward.
            </p>

            <div class="result-box">
                <span class="result-icon">🎯</span>

                <h2>Mission objectives</h2>

                <p>
                    Acquire food, continue building your empire and deploy
                    enough British sarcasm to confuse everyone nearby.
                </p>
            </div>

            <button
                class="primary-button"
                data-action="accept-mission"
                type="button"
            >
                Accept mission
            </button>

            <p class="small-message">
                Refusal is technically possible, but rather rude.
            </p>
        </div>
    `;
}

function renderMissionOne() {
    updateStatus("Mission 01 · Kebab protocol");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Mission 01</p>

            <h2 class="screen-title">
                Critical
                <span>kebab protocol</span>
            </h2>

            <p class="mission-copy">
                After several hours working on the house, hunger reaches
                dangerous levels. What does Sam do?
            </p>

            <div class="choice-grid">
                <button
                    class="choice-button"
                    data-action="mission-one-choice"
                    data-choice="kebab"
                    type="button"
                >
                    <span class="choice-icon">🥙</span>
                    <strong>Legendary kebab</strong>
                    <small>
                        Order the biggest kebab available and add chilli
                        sauce with reckless confidence.
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-one-choice"
                    data-choice="sensible"
                    type="button"
                >
                    <span class="choice-icon">🥗</span>
                    <strong>Sensible dinner</strong>
                    <small>
                        Choose something healthy and deeply disappoint
                        everyone involved.
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-one-choice"
                    data-choice="building"
                    type="button"
                >
                    <span class="choice-icon">🧱</span>
                    <strong>Keep building</strong>
                    <small>
                        Ignore the hunger. One more wall will surely solve
                        everything.
                    </small>
                </button>
            </div>
        </div>
    `;
}

function selectMissionOneChoice(choice) {
    const outcomes = {
        kebab: {
            icon: "🥙",
            title: "Kebab acquired",
            text:
                "Excellent decision. Energy restored. Chilli sauce activated. " +
                "Shirt survival probability is now approximately 42%.",
            scores: {
                kebab: 3,
                chaos: 1
            },
            notification: "+3 Kebab power · +1 Chaos"
        },

        sensible: {
            icon: "🥗",
            title: "Suspiciously responsible",
            text:
                "A balanced meal has been selected. Nobody expected this " +
                "plot twist, but the mission may continue.",
            scores: {
                builder: 1
            },
            notification: "+1 Builder skill"
        },

        building: {
            icon: "🧱",
            title: "Hunger ignored",
            text:
                "Three hours later, the wall looks better and your stomach " +
                "has submitted a formal complaint.",
            scores: {
                builder: 3,
                chaos: 2
            },
            notification: "+3 Builder skill · +2 Chaos"
        }
    };

    const outcome = outcomes[choice];

    addScores(outcome.scores);
    showNotification(outcome.notification);

    transitionTo(() => {
        renderOutcome(
            "Mission 01 complete",
            outcome,
            "mission-two",
            "Continue to mission 02"
        );
    });
}

function renderMissionTwo() {
    updateStatus("Mission 02 · Building operations");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Mission 02</p>

            <h2 class="screen-title">
                The house
                <span>needs a decision</span>
            </h2>

            <p class="mission-copy">
                A new section of the house is ready, but an important design
                decision remains. Choose your construction strategy.
            </p>

            <div class="choice-grid">
                <button
                    class="choice-button"
                    data-action="mission-two-choice"
                    data-choice="measure"
                    type="button"
                >
                    <span class="choice-icon">📐</span>
                    <strong>Measure everything</strong>
                    <small>
                        Measure twice, check once more and build it properly.
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-two-choice"
                    data-choice="improvise"
                    type="button"
                >
                    <span class="choice-icon">🔨</span>
                    <strong>Improvise</strong>
                    <small>
                        Say “that looks about right” and hope physics agrees.
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-two-choice"
                    data-choice="ask-liana"
                    type="button"
                >
                    <span class="choice-icon">📱</span>
                    <strong>Ask Liana</strong>
                    <small>
                        Send another house photo and request professional
                        international design advice.
                    </small>
                </button>
            </div>
        </div>
    `;
}

function selectMissionTwoChoice(choice) {
    const outcomes = {
        measure: {
            icon: "📐",
            title: "Precision achieved",
            text:
                "Everything is straight, secure and annoyingly sensible. " +
                "The spirit level officially approves.",
            scores: {
                builder: 3
            },
            notification: "+3 Builder skill"
        },

        improvise: {
            icon: "🔨",
            title: "Probably secure",
            text:
                "It looks excellent from the correct angle. That angle has " +
                "now been permanently marked on the floor.",
            scores: {
                builder: 1,
                chaos: 3
            },
            notification: "+1 Builder skill · +3 Chaos"
        },

        "ask-liana": {
            icon: "📱",
            title: "International consultation",
            text:
                "Strategic move. Free design advice and a perfectly good " +
                "excuse to send Liana another house update.",
            scores: {
                builder: 2,
                chaos: 1
            },
            notification: "+2 Builder skill · +1 Clever move"
        }
    };

    const outcome = outcomes[choice];

    addScores(outcome.scores);
    showNotification(outcome.notification);

    transitionTo(() => {
        renderOutcome(
            "Mission 02 complete",
            outcome,
            "mission-three",
            "Continue to mission 03"
        );
    });
}

function renderMissionThree() {
    updateStatus("Mission 03 · British humour test");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Mission 03</p>

            <h2 class="screen-title">
                British humour
                <span>assessment</span>
            </h2>

            <p class="mission-copy">
                Someone says: “Twenty-nine already? At this rate, the house
might be finished before you're 30.” Select your response.
            </p>

            <div class="choice-grid">
                <button
                    class="choice-button"
                    data-action="mission-three-choice"
                    data-choice="deadpan"
                    type="button"
                >
                    <span class="choice-icon">😐</span>
                    <strong>Stay completely serious</strong>
                    <small>
                        “Brilliant. I'll put that on the welcome mat.”
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-three-choice"
                    data-choice="comeback"
                    type="button"
                >
                    <span class="choice-icon">🎤</span>
                    <strong>Return fire</strong>
                    <small>
                        “The house is still younger than that joke.”
                    </small>
                </button>

                <button
                    class="choice-button"
                    data-action="mission-three-choice"
                    data-choice="kebab-ban"
                    type="button"
                >
                    <span class="choice-icon">🚫</span>
                    <strong>Act offended</strong>
                    <small>
                        “Unacceptable. Your kebab privileges are revoked.”
                    </small>
                </button>
            </div>
        </div>
    `;
}

function selectMissionThreeChoice(choice) {
    const outcomes = {
        deadpan: {
            icon: "😐",
            title: "Maximum deadpan",
            text:
                "Nobody can tell whether you are joking. The British humour " +
                "assessment has been passed with distinction.",
            scores: {
                chaos: 3
            },
            notification: "+3 British chaos"
        },

        comeback: {
            icon: "🎤",
            title: "Successful counterattack",
            text:
                "Direct hit. The opposing joke has been defeated and the " +
                "building site remains emotionally secure.",
            scores: {
                chaos: 2,
                builder: 1
            },
            notification: "+2 British chaos · +1 Builder skill"
        },

        "kebab-ban": {
            icon: "🚫",
            title: "Ultimate punishment",
            text:
                "The threat is devastating. Order is immediately restored " +
                "and every nearby kebab is placed under protection.",
            scores: {
                kebab: 2,
                chaos: 2
            },
            notification: "+2 Kebab power · +2 British chaos"
        }
    };

    const outcome = outcomes[choice];

    addScores(outcome.scores);
    showNotification(outcome.notification);

    transitionTo(() => {
        renderOutcome(
            "Mission 03 complete",
            outcome,
            "show-results",
            "View mission results"
        );
    });
}

function renderOutcome(label, outcome, nextAction, buttonText) {
    updateStatus(label);

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">${label}</p>

            <div class="result-box">
                <span class="result-icon">${outcome.icon}</span>
                <h2>${outcome.title}</h2>
                <p>${outcome.text}</p>
            </div>

            <button
                class="primary-button"
                data-action="${nextAction}"
                type="button"
            >
                ${buttonText}
            </button>
        </div>
    `;
}

function createScoreBoard() {
    return `
        <div class="score-board">
            <div class="score-item">
                <span>Kebab power</span>
                <strong>${gameState.scores.kebab}</strong>
            </div>

            <div class="score-item">
                <span>Builder skill</span>
                <strong>${gameState.scores.builder}</strong>
            </div>

            <div class="score-item">
                <span>British chaos</span>
                <strong>${gameState.scores.chaos}</strong>
            </div>
        </div>
    `;
}

function getPlayerProfile() {
    const scores = Object.entries(gameState.scores);
    scores.sort((first, second) => second[1] - first[1]);

    const highestScore = scores[0][0];

    const profiles = {
        kebab: {
            icon: "🥙",
            title: "Commander of Kebabs",
            text:
                "Powered by questionable amounts of garlic sauce and " +
                "fully prepared for any late-night emergency."
        },

        builder: {
            icon: "🏠",
            title: "Master Builder",
            text:
                "Capable of constructing an entire kingdom one careful " +
                "house update at a time."
        },

        chaos: {
            icon: "🇬🇧",
            title: "Lord of British Chaos",
            text:
                "Armed with dangerous sarcasm, perfect timing and absolutely " +
                "no intention of explaining the joke."
        }
    };

    return profiles[highestScore];
}

function renderResults() {
    updateStatus("Mission results");

    const profile = getPlayerProfile();

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Assessment complete</p>

            <h2 class="screen-title">
                Mission
                <span>successful</span>
            </h2>

            <div class="result-box">
                <span class="result-icon">${profile.icon}</span>
                <h2>${profile.title}</h2>
                <p>${profile.text}</p>

                ${createScoreBoard()}
            </div>

            <button
                class="primary-button"
                data-action="show-card"
                type="button"
            >
                Claim legendary card
            </button>
        </div>
    `;

    createConfetti(55);
}

function renderMagicCard() {
    updateStatus("Legendary card unlocked");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Legendary reward unlocked</p>

            <h2 class="screen-title">
                Custom
                <span>birthday card</span>
            </h2>

            <article class="magic-card">
                <div class="magic-card-header">
                    <h3>Sam, Builder of Two Worlds</h3>
                    <span>2GW</span>
                </div>

                <div class="magic-card-art">
    <img
        src="Constructor mágico frente a aldea francesa.png"
        alt="Sam holding building plans beside his unfinished house in a French village, with an England patch on his sleeve."
        style="display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; position: relative; z-index: 1;"
    >
</div>
                <div class="magic-card-type">
                    Legendary Creature — Human Builder
                </div>

                <div class="magic-card-rules">
                    <p>
                        Whenever Sam improves his house, create a Treasure
                        token.
                    </p>

                    <p>
                        Whenever Sam eats a kebab, restore all lost energy
                        and put a +1/+1 counter on him.
                    </p>

                    <p>
                        If British sarcasm was used this turn, Sam gains
                        indestructible until bedtime.
                    </p>

                    <em>
                        “One house, one kebab and one legendary birthday
                        at a time.”
                    </em>
                </div>

                <div class="magic-card-footer">
                    <small>001/001 · Birthday edition</small>
                    <strong>4/4</strong>
                </div>
            </article>

            <button
                class="primary-button"
                data-action="show-secrets"
                type="button"
            >
                Open secret dossier
            </button>
        </div>
    `;
}

function renderSecretMessages() {
    updateStatus("Secret dossier");

    gameState.secretsOpened.clear();

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Authorised access only</p>

            <h2 class="screen-title">
                Three secret
                <span>messages</span>
            </h2>

            <p class="mission-copy">
                Open all three classified files to gain access to the final
                birthday reward.
            </p>

            <div class="choice-grid">
                ${secretMessages
                    .map(
                        (message, index) => `
                            <button
                                class="choice-button"
                                data-action="reveal-secret"
                                data-secret="${index}"
                                type="button"
                            >
                                <span class="choice-icon">🔒</span>
                                <strong>Secret file ${index + 1}</strong>
                                <small>Click to decrypt</small>
                            </button>
                        `
                    )
                    .join("")}
            </div>

            <button
                id="finalRewardButton"
                class="primary-button"
                data-action="show-reward"
                type="button"
                hidden
            >
                Access final reward
            </button>
        </div>
    `;
}

function revealSecret(button) {
    const secretNumber = Number(button.dataset.secret);

    if (gameState.secretsOpened.has(secretNumber)) {
        return;
    }

    const secret = secretMessages[secretNumber];

    gameState.secretsOpened.add(secretNumber);

    button.innerHTML = `
        <span class="choice-icon">${secret.icon}</span>
        <strong>${secret.title}</strong>
        <small>${secret.text}</small>
    `;

    button.disabled = true;
    button.style.cursor = "default";
    button.style.borderColor = "var(--bright-green)";
    button.style.background = "rgba(55, 92, 57, 0.72)";

    showNotification(
        `Secret ${gameState.secretsOpened.size} of 3 decrypted`
    );

    if (gameState.secretsOpened.size === secretMessages.length) {
        const finalRewardButton =
            document.getElementById("finalRewardButton");

        finalRewardButton.hidden = false;
        createConfetti(35);
    }
}

function renderFinalReward() {
    updateStatus("Mission complete");

    gameScreen.innerHTML = `
        <div class="screen-content">
            <p class="eyebrow">Final reward</p>

            <h2 class="screen-title">
                Mystery reward
                <span>reserved</span>
            </h2>

            <div class="secret-box">
                <span class="result-icon">🔐</span>

                <h2>Delivery pending</h2>

               <h3>A little note from me</h3>

<p>Sam,</p>

<p>
    I made all of this with love. I’ve grown so fond of you in the time
    we’ve been talking. I care about you a lot, and I’m sending you a big
    hug from 10,866 kilometres away. I wanted to show you how much you
    mean to me in a way that would make you laugh.
</p>

<p>
    I really hope you like your birthday surprise. I had so much fun
    making it for you, and honestly, I couldn’t wait to show it to you.
</p>

<p>Happy 29th, you old man. 🤍</p>

<hr>

<p>
    Some rewards can’t be sent through a screen. I’ve saved yours for you,
    and I’ll give it to you when we finally meet.
</p>

                <p>
                    Status: secure, slightly suspicious and worth the wait.
                </p>
            </div>

            <p class="mission-copy">
                Mission complete. Happy 29th birthday, old man! 🎂
            </p>

            <button
                class="primary-button"
                data-action="restart"
                type="button"
            >
                Play again
            </button>
        </div>
    `;

    createConfetti(100);
}

function createConfetti(amount) {
    const colours = [
        "#a8ff67",
        "#f5c542",
        "#f07b27",
        "#f5edda",
        "#d84432"
    ];

    for (let index = 0; index < amount; index += 1) {
        const confettiPiece = document.createElement("span");

        confettiPiece.className = "confetti";
        confettiPiece.style.left = `${Math.random() * 100}vw`;
        confettiPiece.style.background =
            colours[Math.floor(Math.random() * colours.length)];
        confettiPiece.style.animationDuration =
            `${2.5 + Math.random() * 3}s`;
        confettiPiece.style.animationDelay =
            `${Math.random() * 0.8}s`;

        document.body.appendChild(confettiPiece);

        window.setTimeout(() => {
            confettiPiece.remove();
        }, 6500);
    }
}

function restartGame() {
    gameState.scores.kebab = 0;
    gameState.scores.builder = 0;
    gameState.scores.chaos = 0;
    gameState.secretsOpened.clear();

    transitionTo(renderIntro);
}

function renderIntro() {
    updateStatus("Classified mission");

    gameScreen.innerHTML = `
        <div class="intro-content">
            <p class="mission-label">
                Birthday operation · Level 29
            </p>

            <h1>
                Sam's
                <span>Birthday Quest</span>
            </h1>

            <p class="intro-text">
                One British man. Several questionable decisions.
                An unreasonable number of kebabs.
            </p>

            <p class="classified-message">
                A highly classified adventure created especially for Sam.
            </p>

            <button
                id="startButton"
                class="primary-button"
                type="button"
            >
                Begin the mission
            </button>

            <p class="small-message">
                Headphones optional. British humour required.
            </p>
        </div>
    `;
}
/* CINEMATIC CAR INTRO */

let cinematicHasStarted = false;

gameScreen.addEventListener(
    "click",
    handleCinematicControls,
    true
);

function handleCinematicControls(event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.id === "launchCinematic") {
        event.preventDefault();
        event.stopPropagation();

        if (cinematicHasStarted) {
            return;
        }

        cinematicHasStarted = true;
        button.disabled = true;

        startCinematicIntro();
        return;
    }

    if (button.id === "startButton") {
        gameScreen.classList.remove(
            "cinematic-mode",
            "cinematic-running",
            "cinematic-arrived"
        );

        return;
    }

    if (button.dataset.action === "restart") {
        event.preventDefault();
        event.stopPropagation();

        window.location.reload();
    }
}

function startCinematicIntro() {
    updateStatus("Vehicle approaching");

    gameScreen.classList.add("cinematic-running");

    playCarArrivalSound();

    window.setTimeout(() => {
        gameScreen.classList.add("cinematic-arrived");
        updateStatus("Sam has arrived");
    }, 4150);
}

function playCarArrivalSound() {
    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        return;
    }

    const audioContext = new AudioContextClass();

    audioContext
        .resume()
        .then(() => {
            createEngineSound(audioContext);
        })
        .catch(() => {
            updateStatus("Vehicle approaching");
        });
}

function createEngineSound(audioContext) {
    const startTime = audioContext.currentTime;
    const finishTime = startTime + 5.4;

    const masterGain = audioContext.createGain();
    const engineFilter = audioContext.createBiquadFilter();

    const stereoNode = audioContext.createStereoPanner
        ? audioContext.createStereoPanner()
        : audioContext.createGain();

    masterGain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    masterGain.gain.exponentialRampToValueAtTime(
        0.08,
        startTime + 1.2
    );

    masterGain.gain.exponentialRampToValueAtTime(
        0.24,
        startTime + 3.5
    );

    masterGain.gain.setValueAtTime(
        0.2,
        startTime + 4.15
    );

    masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        finishTime
    );

    engineFilter.type = "lowpass";

    engineFilter.frequency.setValueAtTime(
        190,
        startTime
    );

    engineFilter.frequency.exponentialRampToValueAtTime(
        950,
        startTime + 3.7
    );

    engineFilter.frequency.exponentialRampToValueAtTime(
        280,
        finishTime
    );

    engineFilter.Q.setValueAtTime(
        3,
        startTime
    );

    if (stereoNode.pan) {
        stereoNode.pan.setValueAtTime(
            -0.85,
            startTime
        );

        stereoNode.pan.linearRampToValueAtTime(
            0.68,
            startTime + 4.5
        );
    }

    engineFilter.connect(stereoNode);
    stereoNode.connect(masterGain);
    masterGain.connect(audioContext.destination);

    createEngineOscillator(
        audioContext,
        engineFilter,
        "sawtooth",
        48,
        152,
        72,
        0.62,
        startTime,
        finishTime
    );

    createEngineOscillator(
        audioContext,
        engineFilter,
        "triangle",
        96,
        304,
        144,
        0.23,
        startTime,
        finishTime
    );

    createEngineOscillator(
        audioContext,
        engineFilter,
        "square",
        24,
        76,
        36,
        0.06,
        startTime,
        finishTime
    );

    createRoadNoise(
        audioContext,
        stereoNode,
        startTime,
        finishTime
    );

    createBrakeSound(
        audioContext,
        masterGain,
        startTime
    );

    window.setTimeout(() => {
        audioContext.close();
    }, 6200);
}

function createEngineOscillator(
    audioContext,
    destination,
    waveType,
    startingFrequency,
    highestFrequency,
    endingFrequency,
    volume,
    startTime,
    finishTime
) {
    const oscillator = audioContext.createOscillator();
    const oscillatorGain = audioContext.createGain();

    oscillator.type = waveType;

    oscillator.frequency.setValueAtTime(
        startingFrequency,
        startTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        highestFrequency,
        startTime + 3.7
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        endingFrequency,
        finishTime
    );

    oscillatorGain.gain.setValueAtTime(
        volume,
        startTime
    );

    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(destination);

    oscillator.start(startTime);
    oscillator.stop(finishTime);
}

function createRoadNoise(
    audioContext,
    destination,
    startTime,
    finishTime
) {
    const soundLength = Math.ceil(
        audioContext.sampleRate * 5.5
    );

    const noiseBuffer = audioContext.createBuffer(
        1,
        soundLength,
        audioContext.sampleRate
    );

    const noiseData = noiseBuffer.getChannelData(0);

    for (
        let index = 0;
        index < soundLength;
        index += 1
    ) {
        noiseData[index] =
            Math.random() * 2 - 1;
    }

    const noiseSource =
        audioContext.createBufferSource();

    const noiseFilter =
        audioContext.createBiquadFilter();

    const noiseGain =
        audioContext.createGain();

    noiseSource.buffer = noiseBuffer;

    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(
        240,
        startTime
    );

    noiseFilter.frequency.exponentialRampToValueAtTime(
        1100,
        startTime + 3.8
    );

    noiseGain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    noiseGain.gain.exponentialRampToValueAtTime(
        0.08,
        startTime + 3.5
    );

    noiseGain.gain.exponentialRampToValueAtTime(
        0.0001,
        finishTime
    );

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    noiseSource.start(startTime);
    noiseSource.stop(finishTime);
}

function createBrakeSound(
    audioContext,
    destination,
    startTime
) {
    const brake = audioContext.createOscillator();
    const brakeGain = audioContext.createGain();

    brake.type = "sine";

    brake.frequency.setValueAtTime(
        720,
        startTime + 3.95
    );

    brake.frequency.exponentialRampToValueAtTime(
        125,
        startTime + 4.42
    );

    brakeGain.gain.setValueAtTime(
        0.0001,
        startTime + 3.9
    );

    brakeGain.gain.exponentialRampToValueAtTime(
        0.11,
        startTime + 4.02
    );

    brakeGain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + 4.48
    );

    brake.connect(brakeGain);
    brakeGain.connect(destination);

    brake.start(startTime + 3.9);
    brake.stop(startTime + 4.5);
}
/* Silenciar el motor artificial */
playCarArrivalSound = function () {};
/* REAL BMW ENGINE SOUND */

let realCarAudio = null;

playCarArrivalSound = function () {
    if (realCarAudio) {
        realCarAudio.pause();
        realCarAudio.remove();
    }

    const audio = document.createElement("audio");

    const possibleFileNames = [
        "freesound_community-audio-m4-wav-50124.mp3",
        "audio-m4-wav-50124.mp3",
        "AUDIO M4 WAV.mp3",
        "audio-m4-wav-50124 (1).mp3",
        "AUDIO M4 WAV (1).mp3"
    ];

    possibleFileNames.forEach((fileName) => {
        const source = document.createElement("source");

        source.src = fileName;
        source.type = "audio/mpeg";

        audio.appendChild(source);
    });

    audio.preload = "auto";
    audio.volume = 0.04;

    document.body.appendChild(audio);

    realCarAudio = audio;

    const playAttempt = audio.play();

    if (!playAttempt) {
        return;
    }

    playAttempt
        .then(() => {
            const fadeInStart = performance.now();

            const fadeIn = window.setInterval(() => {
                const elapsed =
                    performance.now() - fadeInStart;

                const progress = Math.min(
                    elapsed / 3300,
                    1
                );

                audio.volume =
                    0.04 + progress * 0.56;

                if (progress === 1) {
                    window.clearInterval(fadeIn);
                }
            }, 80);

            window.setTimeout(() => {
                window.clearInterval(fadeIn);

                const fadeOutStart =
                    performance.now();

                const startingVolume =
                    audio.volume;

                const fadeOut =
                    window.setInterval(() => {
                        const elapsed =
                            performance.now() -
                            fadeOutStart;

                        const progress = Math.min(
                            elapsed / 950,
                            1
                        );

                        audio.volume =
                            startingVolume *
                            (1 - progress);

                        if (progress === 1) {
                            window.clearInterval(
                                fadeOut
                            );

                            audio.pause();
                            audio.remove();
                        }
                    }, 60);
            }, 4100);
        })
        .catch(() => {
            updateStatus("Audio file not found");
        });
};
/* ELECTRONIC BACKGROUND MUSIC */

let birthdayBackgroundMusic = null;

playCarArrivalSound = function () {
    const music = new Audio("dstechnician-neonon-109616.mp3");
    birthdayBackgroundMusic = music;
    music.loop = true;
    music.volume = 0.18;
    music.play().catch((error) => {
        console.warn("Could not play the background music:", error);
    });
};