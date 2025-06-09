window.showSection = (id) => {
  ['overview', 'about', 'examples'].forEach(sec => {
    document.getElementById(sec).style.display = (sec === id) ? 'block' : 'none';
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // Show only overview at start
  showSection('overview');

  // Load examples as before
  fetch('http://localhost:3000/api/examples')
    .then(res => res.json())
    .then(data => {
      const examplesList = document.getElementById('examples-list');
      examplesList.innerHTML = '';
      data.examples.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = `${doc.title}: ${doc.content}`;
        examplesList.appendChild(li);
      });
    });
});
