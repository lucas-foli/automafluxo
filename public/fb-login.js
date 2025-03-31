function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        // Usuário logado no Facebook – prosseguir para buscar dados da conta
        getBusinessAccount();
    } else {
        document.getElementById('status').innerHTML = 'Por favor, faça login no Facebook.';
    }
}

function getBusinessAccount() {
    // Primeiro, obter informações básicas do usuário (opcional)
    FB.api('/me?fields=id,name', function (userResponse) {
        const fbUserId = userResponse.id;
        // Salve o fbUserId e o nome do usuário no banco de dados
        saveUserToDatabase({
            fbUserId,
            name: userResponse.name
        });
        console.log('Logado como: ' + userResponse.name);
        document.getElementById('status').innerHTML =
            'Obrigado por fazer login, ' + userResponse.name + '!<br>';

        // Agora, buscar as páginas que o usuário administra, incluindo dados do Instagram Business Account
        FB.api('/me/accounts?fields=name,instagram_business_account', function (pagesResponse) {
            if (pagesResponse && pagesResponse.data) {
                let found = false;
                pagesResponse.data.forEach(page => {
                    if (page.instagram_business_account) {
                        console.log('Conta de Negócio do Instagram encontrada na página ' + page.name + ': ' + page.instagram_business_account.id);
                        document.getElementById('status').innerHTML +=
                            'Conta de Negócio do Instagram encontrada na página ' + page.name +
                            ': ' + page.instagram_business_account.id + '<br>';
                        found = true;
                        updateUserInstagramId(fbUserId, page.instagram_business_account.id);

                    }
                });
                if (!found) {
                    console.log('Nenhuma conta de negócio do Instagram vinculada às suas páginas foi encontrada.');
                    document.getElementById('status').innerHTML += 'Nenhuma conta de negócio do Instagram vinculada foi encontrada.<br>';
                }
            } else {
                console.error('Erro ao buscar páginas.');
                document.getElementById('status').innerHTML += 'Erro ao buscar suas páginas.<br>';
            }
        });
    });
}

function saveUserToDatabase({ fbUserId, name }) {
    localStorage.setItem('fb-creds', { id: fbUserId, name })
}
  
function updateUserInstagramId({ fbUserId, name }) {
    saveUserToDatabase({ fbUserId, name })
}