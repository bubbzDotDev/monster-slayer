function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            roundsForSpecial: 4,
            roundsForHeal: 3,
            winner: null,
            logMessages: [],
            logNumber: 0,
        };
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return { width: '0%'};
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: '0%'};
            }
            return {width: this.playerHealth + '%'};
        },
        mayNotUseSpecialAttack() {
            if (this.roundsForSpecial < 4) {
                return true;
            } else {
                return false;
            }
        },
        mayNotUseHeal() {
            if (this.playerHealth === 100) {
                return true;
            }
            if (this.roundsForHeal < 3) {
                return true;
            } else {
                return false;
            }
        }
    },
    watch: {
        playerHealth(value) {
            if (value === 0) {
                // Player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value === 0) {
                // Monster lost
                this.winner = 'player';
            }
        }
    },
    methods: {
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.roundsForSpecial = 4;
            this.roundsForHeal = 3;
            this.logMessages = [];
            this.logNumber = 0;
        },
        attackMonster() {
            this.roundsForSpecial++;
            this.roundsForHeal++;
            this.logNumber++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            if (this.monsterHealth < 0) {
                this.monsterHealth = 0;
            }
            this.addLogMessage(this.logNumber, 'player', 'attack', attackValue, this.monsterHealth);
            if (this.monsterHealth > 0) {
                this.attackPlayer();
            }
        },
        attackPlayer() {
            this.logNumber++;
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            if (this.playerHealth < 0) {
                this.playerHealth = 0;
            }
            this.addLogMessage(this.logNumber, 'monster', 'attack', attackValue, this.playerHealth);
        },
        specialAttackMonster() {
            this.roundsForHeal++;
            this.logNumber++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            if (this.monsterHealth < 0) {
                this.monsterHealth = 0;
            }
            this.addLogMessage(this.logNumber, 'player', 'special-attack', attackValue, this.monsterHealth);
            if (this.monsterHealth > 0) {
                this.attackPlayer();
            }
            this.roundsForSpecial = 0;
        },
        healPlayer() {
            this.roundsForSpecial++;
            this.logNumber++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage(this.logNumber, 'player', 'heal', healValue, this.playerHealth);
            this.attackPlayer();
            this.roundsForHeal = 0;
        },
        surrender() {
            this.winner = 'monster';
        },
        addLogMessage(number, who, what, value, health) {
            this.logMessages.unshift({
                actionNum: number,
                actionBy: who,
                actionType: what,
                actionValue: value,
                actionHealth: health
            });
        }
    }
});

app.mount('#game');