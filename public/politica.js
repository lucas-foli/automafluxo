// Função para carregar a Política de Privacidade
const carregarPolitica = async () => {
    try {
        const response = await fetch('public/politica-privacidade.md');
        if (!response.ok) throw new Error('Erro ao carregar o arquivo');

        const text = await response.text();
        const data = marked.parse(text);
        document.getElementById('politica-texto').innerHTML = data;
    } catch (error) {
        document.getElementById('politica-texto').textContent = 'Erro ao carregar a Política de Privacidade.';
        console.error('Erro ao buscar o arquivo:', error);
    }
};

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', carregarPolitica);