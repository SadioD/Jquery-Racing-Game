/***************************************** REQUIREMENTS FOR CHROME *************************************************************
                                        1. Open chrome://flags/#autoplay-policy
                                        2. Setting No user gesture is required
                                        3. Relaunch Chrome
*********************************************************************************************************************************/
$(function() {
    // Initialisation du Jeu ------------------------------------------------------------------------------------------------------
    // Définition de la variable de collision (ok) + des paramètres SPEED + Cacher le Jeu en arrière plan + Faire clignoter "START RACE"
    var ok = 1;

    jQuery.fx.speeds.slow = 2700;
    jQuery.fx.speeds.fast = 1700;
    setTimeout("alert('Ce jeu est développé par Sadio DIALLO - utilisez les touches GAUCHE, DROITE, HAUT et BAS du clavier pour déplacer le véhicule JAUNE');", 1100);
    setTimeout('alert("Pour passer au niveau suivant, restez en vie jusqu\'à la fin de la musique - Amusez-vous bien!");',1800);
    setTimeout(setAudio, 1800, 'opening');
    setInterval("$('#startRace').fadeOut(900).fadeIn(900);", 700);
    //-------------------------------------------------------------------------------------------------------------------------------
    // Les Fonctions du Jeu ----------------------------------------------------------------------------------------------------------
    // Lance le jeu après avoir cliqué sur START
    function startGame() {
        setAudio('start');
        setAudio('backgroundFirst');
        $('#poster').fadeOut(1100);
        $('#jeu').fadeIn(800);
        $('p, #info').fadeIn(800);
        setTimeout(moveElements, 5000, 2700);
        setTimeout(startLevelTwo, 114000);
        setInterval(setCrash, 20, '#vr')
    }
    // Gère le niveau 2
    function startLevelTwo(intervalID) {
        alert('Bravo... Vous avez atteint le second niveau!');
        alert('Attention, le trou fait glisser!');
        setAudio('backgroundSecond');
        $('#trou').show();
        setInterval(setCrash, 20, '#trou');
    }
    // Gère le son F-Zero (start - looping - gameOver)
    function setAudio(status) {
        // Le son du menu START
        if(status == 'opening') {
            $('#fzer_opening')[0].play();
        }
        // Le son du début de la course
        else if(status == 'start') {
            $('#fzer_opening')[0].pause();
            $('#fzeroStart')[0].play();
        }
        // La première musique du jeu
        else if(status == 'backgroundFirst') {
            setTimeout("$('#fzeroBackground_first')[0].play();", 5000);
        }
        // La seconde musique du jeu
        else if(status == 'backgroundSecond') {
            $('#fzeroBackground_second').attr('loop', true)[0].play();
        }
        // Le son Game-Over
        else if(status == 'gameOver') {
            $('#fzeroStart')[0].pause();
            $('#fzeroBackground_first')[0].pause();
            $('#fzeroBackground_second')[0].pause();
            $('#gameOver')[0].play();
        }
        // Le son du crash
        else if(status == 'carCrash') {
            $('#crashSound')[0].play();
        }
    }
    // Les déplacements de la route (fond + Voiture Rouge)
    function moveElements(carSpeed)
    {
        // Déplace la voiture Rouge
        $('#vr').animate({top: '460'}, carSpeed, 'linear', function() {
            var vrX = Math.floor(Math.random() * 194) + 98;
            var vrY = -160;
            $('#vr').show();
            $('#vr').css('top',vrY);
            $('#vr').css('left',vrX);
            ok = 1;
        });
        // Déplace le trou
        $('#trou').animate({top: '460'}, 'slow', 'linear', function() {
            var vrX = Math.floor(Math.random() * 194) + 98;
            var vrY = -160;
            $('#trou').css('top',vrY);
            $('#trou').css('left',vrX);
        });
        // Définit la vitesse aléatoire du véhicule
        var randomSpeed  = [2400, 1700, 2000, 1500];
        var randomNumber = Math.floor(Math.random() * randomSpeed.length);

        // Déplace le background
        $('.fond').animate({top: '-=360'}, 1000, 'linear', function() {
            $('.fond').css('top', 0);
            moveElements(randomSpeed[randomNumber]);
        });
    }
    // Gère les collisions
    function setCrash(item) {
        vjX = parseInt($('#vj').css('left'));
        vjY = parseInt($('#vj').css('top'));
        vrX = parseInt($(item).css('left'));
        vrY = parseInt($(item).css('top'));
        if (((vrX > vjX) && (vrX < (vjX+66)) && (vrY > vjY) && (vrY < (vjY+150)) &&(ok == 1))
        || ((vjX > vrX)  && (vjX < (vrX+66)) && (vrY > vjY) && (vrY < (vjY+150)) && (ok == 1))) {

            if(item == '#vr') {
                if(parseInt($('#info').text()) == 9)
                {
                    // S'il y a crash et que le joueur a déja 9 crash => on affiche Game - Over
                    // On reload la page si le joueur souhaite rejouer si NON, on le redirige
                    setAudio('gameOver');
                    alert('Game Over - Vous avez perdu!');
                    if(confirm('Souhaitez-vous rejouer ?')) {
                        location.reload();
                    }
                    else {
                        alert('Vous allez être redirigé!');
                        window.location.href = 'tpFormInteractif.php';
                    }
                }
                else {
                    // S'il y a crash, on joue le son du crash et on affiche le nombre de crash
                    setAudio('carCrash');
                    collision = parseInt($('#info').text()) + 1;
                    $('#info').text(collision);
                    $('#vr').hide();
                    ok = 0;
                }
            }
            else if(item == '#trou') {
                $('#vj').css('transform', 'rotate(30deg)');
                setTimeout("$('#vj').css('transform', 'rotate(0deg)');", 1000);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------------------------------
    // Evènements -------------------------------------------------------------------------------------------------------------------
    // Déplace la voiture Jaune
    $(document).keydown(function(e)
    {
        // Droite - vjX doit etre > au décor droit (280)
        if(e.which == 39) {
            var vjX = parseInt($('#vj').css('left'));
            if(vjX < 280) $('#vj').css('left', vjX + 20);
        }
        // Gauche - vjX doit etre supérieur au décor gauche (70)
        if(e.which == 37) {
            var vjX = parseInt($('#vj').css('left'));
            if(vjX > 60)  $('#vj').css('left', vjX - 20);
        }
        // Haut - vjX doit etre inférieur au décor supérieur (70)
        if(e.which == 38) {
            var vjY = parseInt($('#vj').css('top'));
            if(vjY > 100)  $('#vj').css('top', vjY - 20);
        }
        // Haut - vjX doit etre inférieur au décor supérieur (70)
        if(e.which == 40) {
            var vjY = parseInt($('#vj').css('top'));
            if(vjY < 300)  $('#vj').css('top', vjY + 20);
        }
    });
    // Lance  le jeu (après avoir cliqué sur START RACE)
    $('a').click(function(e) {
        e.preventDefault();
        startGame();
    });
    //------------------------------------------------------------------------------------------------------------------------------
});
