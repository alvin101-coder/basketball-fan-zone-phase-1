const fetchPlayers = () => {
    fetch('http://localhost:3000/players')
    .then((response) => response.json())
    .then((players) => {
        const celticsPlayers = players.filter(player => player.team === 'Celtics');
        const bucksPlayers = players.filter(player => player.team === 'Bucks');

        displayPlayers(celticsPlayers, 'celtics-players');
        displayPlayers(bucksPlayers, 'bucks-players');
    })
    .catch((error) => console.error('Error fetching players:', error));
};

const displayPlayers = (players, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
        <img src="${player.image}" alt="${player.first_name} ${player.last_name}" class="player-image">
        <h3>${player.first_name} ${player.last_name}</h3>
        <p>Position: ${player.position || 'N/A'}</p>
        <p>Jersey Number: ${player.Jersey_number}</p>
        `;
        container.appendChild(playerCard);
    });
};

// Handle adding comments
const addComment = (commentText) => {
    fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText })
    })
      .then(response => response.json())
      .then(newComment => displayComment(newComment))
      .catch(error => console.error('Error adding comment:', error));
  };
  
  // Display comments
  const displayComment = (comment) => {
    const commentList = document.getElementById('comment-list');
    const commentItem = document.createElement('li');
    commentItem.textContent = comment.text;
    commentList.appendChild(commentItem);
  };
  
  // Handle comment form submission
  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const commentInput = document.getElementById('comment-input');
    addComment(commentInput.value);
    commentInput.value = ''; // Clear input
  });
  
  // Fetch players on page load
  fetchPlayers();