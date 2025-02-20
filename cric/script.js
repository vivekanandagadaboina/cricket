const teamNames = ['India', 'Australia'];
const bowlers = ['Bowler 1', 'Bowler 2', 'Bowler 3', 'Bowler 4', 'Bowler 5'];
let currentBowlerIndex = 0;
let runs = [0, 0];
let wickets = [0, 0];
let balls = [0, 0];
let overs = [0, 0];
let isBatting = true;
let currentInnings = 0;

function playShot(shotType) {
    if (overs[currentInnings] >= 20 || wickets[currentInnings] >= 10) {
        endInnings();
        return;
    }

    balls[currentInnings]++;
    if (balls[currentInnings] > 5) {
        overs[currentInnings]++;
        balls[currentInnings] = 0;
        changeBowler();
    }

    updateScoreboard();

    let outcome = getOutcome(shotType);
    let feedbackElement = document.getElementById('feedback');

    if (outcome === 'wicket') {
        wickets[currentInnings]++;
        feedbackElement.textContent = "Wicket! You've lost a wicket.";
        feedbackElement.style.color = "red";
    } else {
        runs[currentInnings] += outcome;
        feedbackElement.textContent = `You scored ${outcome} run${outcome > 1 ? 's' : ''}!`;
        feedbackElement.style.color = "green";
    }

    updateScoreboard();

    if (overs[currentInnings] >= 20 || wickets[currentInnings] >= 10) {
        endInnings();
    }

    drawCricketCanvas();
}

function bowl(bowlType) {
    if (overs[currentInnings] >= 20 || wickets[currentInnings] >= 10) {
        endInnings();
        return;
    }

    balls[currentInnings]++;
    if (balls[currentInnings] > 5) {
        overs[currentInnings]++;
        balls[currentInnings] = 0;
        changeBowler();
    }

    updateScoreboard();

    let outcome = getBowlingOutcome(bowlType);
    let feedbackElement = document.getElementById('feedback');

    if (outcome === 'wicket') {
        wickets[currentInnings]++;
        feedbackElement.textContent = "Wicket! You took a wicket.";
        feedbackElement.style.color = "red";
    } else {
        runs[currentInnings] += outcome;
        feedbackElement.textContent = `Opponent scored ${outcome} run${outcome > 1 ? 's' : ''}.`;
        feedbackElement.style.color = "green";
    }

    updateScoreboard();

    if (overs[currentInnings] >= 20 || wickets[currentInnings] >= 10) {
        endInnings();
    }

    drawCricketCanvas();
}

function getOutcome(shotType) {
    let random = Math.random();
    if (shotType === 'defensive') {
        if (random < 0.1) return 'wicket';
        return Math.floor(random * 3);  // 0, 1, or 2 runs
    } else if (shotType === 'aggressive') {
        if (random < 0.2) return 'wicket';
        return Math.floor(random * 5);  // 0 to 4 runs
    } else if (shotType === 'risky') {
        if (random < 0.3) return 'wicket';
        return Math.floor(random * 7);  // 0 to 6 runs
    }
}

function getBowlingOutcome(bowlType) {
    let random = Math.random();
    if (bowlType === 'fast') {
        if (random < 0.1) return 'wicket';
        return Math.floor(random * 3);  // 0, 1, or 2 runs
    } else if (bowlType === 'spin') {
        if (random < 0.2) return 'wicket';
        return Math.floor(random * 5);  // 0 to 4 runs
    } else if (bowlType === 'swing') {
        if (random < 0.3) return 'wicket';
        return Math.floor(random * 7);  // 0 to 6 runs
    }
}

function changeBowler() {
    currentBowlerIndex = (currentBowlerIndex + 1) % bowlers.length;
    document.getElementById('bowler').textContent = bowlers[currentBowlerIndex];
}

function endInnings() {
    let feedbackElement = document.getElementById('feedback');

    if (currentInnings === 0) {
        currentInnings++;
        resetForNextInnings();
        feedbackElement.textContent = `End of first innings! ${teamNames[0]} scored ${runs[0]} runs with ${wickets[0]} wicket${wickets[0] > 1 ? 's' : ''}. Now it's time to bowl.`;
        document.querySelector('.batting-controls').style.display = 'none';
        document.querySelector('.bowling-controls').style.display = 'block';
    } else {
        let result = '';
        if (runs[0] > runs[1]) {
            result = `${teamNames[0]} wins by ${runs[0] - runs[1]} runs!`;
        } else if (runs[1] > runs[0]) {
            result = `${teamNames[1]} wins by ${10 - wickets[1]} wickets!`;
        } else {
            result = "It's a tie!";
        }
        feedbackElement.textContent = `End of match! ${result}`;
        document.querySelector('.controls').style.display = 'none';
    }
}



function resetForNextInnings() {
    document.getElementById('team2-name').textContent = teamNames[1];
    runs[1] = 0;
    wickets[1] = 0;
    balls[1] = 0;
    overs[1] = 0;
    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById('team1-runs').textContent = runs[0];
    document.getElementById('team1-wickets').textContent = wickets[0];
    document.getElementById('team1-overs').textContent = overs[0];
    document.getElementById('team1-balls').textContent = balls[0];

    document.getElementById('team2-runs').textContent = runs[1];
    document.getElementById('team2-wickets').textContent = wickets[1];
    document.getElementById('team2-overs').textContent = overs[1];
    document.getElementById('team2-balls').textContent = balls[1];
}

function drawCricketCanvas() {
    const canvas = document.getElementById('cricketCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pitch
    ctx.fillStyle = '#964B00';
    ctx.fillRect(300, 0, 200, canvas.height);

    // Draw batting crease
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(300, 350, 200, 10);

    // Draw bowler
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(375, 0, 50, 50);

    // Draw batsman
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(375, 340, 50, 50);

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Team 1: ${runs[0]}/${wickets[0]}`, 10, 20);
    ctx.fillText(`Overs: ${overs[0]}.${balls[0]}`, 10, 50);
    ctx.fillText(`Team 2: ${runs[1]}/${wickets[1]}`, 650, 20);
    ctx.fillText(`Overs: ${overs[1]}.${balls[1]}`, 650, 50);
}

window.onload = () => {
    document.getElementById('team1-name').textContent = teamNames[0];
    document.getElementById('team2-name').textContent = teamNames[1];
    updateScoreboard();
    drawCricketCanvas();
};
