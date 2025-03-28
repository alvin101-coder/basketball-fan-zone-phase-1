const fetchPlayers = () => {
    fetch('http://localhost:3000/players')
    .then((response) => response.json())
    .then((players) => {
        const celticsPlayers = players.filter(player => player.team === 'Celtics');
        const bucksPlayers = players.filter(player => player.team === 'Bucks');

        displayPlayers(celticsPlayers, 'celtics-players');
        displayPlayers(bucksPlayers, 'bucks-players');
        addClickEventToPlayerCards(players);
    })
    .catch((error) => console.error('Error fetching players:', error));
};

const teamHistory = {
    Celtics: "The Boston Celtics are one of the most successful franchises in NBA history, boasting 17 championships.",
    Bucks: "The Milwaaukee Bucks are a powerhouse team, led by Giannis Antetokoumpo and known for their 2021 NBA chanpionship.",
    Lakers: "The Los Angeles Lakers are a legendary team with stars like Kobe Bryant, LeBron James, and Shaquille O'Neal.",
};

const teamLogos = document.querySelectorAll('.team-logo');

teamLogos.forEach(logo => {
    logo.addEventListener('click', () => {
            const teamName = logo.dataset.team;
            displayTeamDetails(teamName);
        });
    });

    const displayTeamDetails = (teamName) => {
        const teamDetailsDiv = document.getElementById(`${teamName}-details`);
        teamDetailsDiv.innerHTML = `
        <h2>${teamName}</h2>
        <p>${teamHistory[teamName]}</p>
        <button id="player-stats-button">View Player Stats</button>
        `;

        teamDetailsDiv.classList.add('active');

        const playerStatsButton = document.getElementById('player-stats-button');
        playerStatsButton.addEventListener('click', () => {
            document.querySelector('#players').scrollIntoView({ behavior: 'smooth' });
        });
    };

const displayPlayers = (players, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.id = `player-${player.id}`;
        playerCard.innerHTML = `
        <img src="${player.image}" alt="${player.first_name} ${player.last_name}" class="player-image">
        <h3>${player.first_name} ${player.last_name}</h3>
        <p>Position: ${player.position || 'N/A'}</p>
        <p>Jersey Number: ${player.Jersey_number}</p>
        `;
        container.appendChild(playerCard);
    });
};

const displayPlayerStats = (player) => {
    const statsModal = document.createElement('div');
    statsModal.className = 'player-stats-modal';
    statsModal.style.backgroundImage = `url($player.image)`;
    statsModal.style.backgroundSize = 'cover';
    statsModal.style.backgroundPosition = 'center';

    statsModal.innerHTML = `
    <div class = "stats-container">
    <h2>${player.first_name} ${player.last_name}</h2>
    <p>Position: ${player.position}</p>
    <p>Team: ${player.team}</p>
    <p>Points Per Game: ${player.stats.points_per_game}</p>
    <p>Rebounds Per Game: ${player.stats.rebounds_per_game}</p>
    <p>Assists Per Game: ${player.stats.assists_per_game}</p>
      <p>Steals Per Game: ${player.stats.steals_per_game}</p>
      <p>Blocks Per Game: ${player.stats.blocks_per_game}</p>
      <button id="close-stats">Close</button>
    </div>
  `;

  document.body.appendChild(statsModal);

 
  document.getElementById('close-stats').addEventListener('click', () => {
    document.body.removeChild(statsModal);
  });
};

const addClickEventToPlayerCards = (players) => {
    players.forEach(player => {
      const playerCard = document.getElementById(`player-${player.id}`);
      if (playerCard) {
        playerCard.addEventListener('click', () => displayPlayerStats(player));
      } else {
        console.error (`Player card for ${player.first_name} ${player.last_name} not found.`);
      }
    });
  };

const addComment = (commentText) => {
    if (!commentText.trim()){
        alert('Please enter a valid comment!');
        return;
    }

    fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText })
    })
      .then(response => response.json())
      .then(newComment => {
        console.log('New comment added:', newComment);
        // displayComment(newComment);
        fetchComments();
    })
      .catch(error => console.error('Error adding comment:', error));
  };
  
  const displayComment = (comment) => {
    if (!comment.text || !comment.text.trim()){
        console.error('Skipped invalid comment:', comment);
        return;
    }

    const commentList = document.getElementById('comment-list');
    const commentItem = document.createElement('li');

    const commentText = document.createElement('p');
    commentText.textContent = comment.text;
    commentItem.appendChild(commentText);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.style.marginLeft = '10px';
    editButton.style.backgroundColor = '#ffa500';
    editButton.style.color = 'white';
    editButton.style.border = 'none';
    editButton.style.padding = '5px 10px';
    editButton.style.borderRadius = '5px';
    editButton.style.cursor = 'pointer';

    editButton.addEventListener('click', () => editComment(comment, commentItem));
    commentItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = ' Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.backgroundColor = '#ff4d4d';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.cursor = 'pointer';

    deleteButton.addEventListener('click', () => deleteComment(comment.id, commentItem));
    commentItem.appendChild(deleteButton);

    commentList.appendChild(commentItem);
  };

  const editComment = (comment, commentItem) => {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = comment.text;
    editInput.style.marginRight = '10px';
  
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.padding = '5px 10px';
    saveButton.style.borderRadius = '5px';
    saveButton.style.cursor = 'pointer';
  
    saveButton.addEventListener('click', () => {
      const updatedText = editInput.value.trim();
      if (!updatedText) {
        alert('Please enter a valid comment!');
        return;
      }
  
      fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedText })
      })
        .then(response => response.json())
        .then(updatedComment => {
  
          commentItem.innerHTML = ''; 
          displayComment(updatedComment); 
        })
        .catch(error => console.error('Error updating comment:', error));
    });
  
    commentItem.innerHTML = '';
    commentItem.appendChild(editInput);
    commentItem.appendChild(saveButton);
  };

  const deleteComment = (commentId, commentItem) => {
    fetch(`http://localhost:3000/comment/${commentId}`,{
        method: 'DELETE',
    })
    .then(() => {
        commentItem.remove();
    })
    .catch(error => console.error('Error deleting comment:', error));
  };

  const fetchComments = () => {
    fetch('http://localhost:3000/comments')
    .then(response => response.json())
    .then(comments => {
        console.log('Fetched comments:', comments);
        const commentList = document.getElementById('comment-list');
        commentList.innerHTML = '';

        comments.forEach(comment => displayComment(comment));
    })
    .catch(error => console.error('Error fetching comments:', error));
  };
  
  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const commentInput = document.getElementById('comment-input');
    addComment(commentInput.value);
    commentInput.value = ''; 
  });
  
  fetchPlayers();
  fetchComments();