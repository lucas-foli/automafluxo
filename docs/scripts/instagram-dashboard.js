document.addEventListener("DOMContentLoaded", async () => {
  const userInfoDiv = document.getElementById("user-info");

  const fetchCommentsBtn = document.getElementById("fetch-comments");
  // const fetchUserBtn = document.getElementById("fetch-user");
  const replyCommentBtn = document.getElementById("reply-comment");
  const fetchMessagesBtn = document.getElementById("fetch-messages");
  const publishContentBtn = document.getElementById("publish-content");
  const fetchInsightsBtn = document.getElementById("fetch-insights");
  const getIgUserId = document.getElementById("get-ig-user-id");
  const commentsList = document.getElementById("comments-list");
  const commentsArea = document.getElementById("comments-area");
  const replyMessageText = document.getElementById("replyMessageText");
  const resultDiv = document.getElementById("result");
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const conversationList = document.getElementById("conversationList");
  const messageList = document.getElementById("messageList");

  const sendReplyBtn = document.getElementById("send-reply");

  const userResponse = await fetch(
    `/api/instagram/fetch-user-info?username=${username}`
  );
  const user = await userResponse.json();
  const { token, profilePictureUrl } = user.user;
  const userId = "17841470936175083";

  console.log(
    "userId:",
    userId,
    "token:",
    token,
    "profilePictureUrl:",
    profilePictureUrl
  );

  userInfoDiv.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
  Welcome
  <img src="${profilePictureUrl}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%;">
    @${username}!
</p>`;

  replyMessageText.addEventListener("input", () => {
    sendReplyBtn.classList.remove("disable");
    sendReplyBtn.removeAttribute("disabled");
    replyCommentBtn.classList.value.includes("disable")
      ? replyCommentBtn.classList.remove("disable")
      : null;
  });

  fetchCommentsBtn.addEventListener("click", async () => {
    sendReplyBtn.hidden = true;
    const mediaIdResponse = await fetch(
      `/api/instagram/get-media?access_token=${token}&userId=${userId}`
    );
    const { mediaId } = await mediaIdResponse.json();

    const commentsResponse = await fetch(
      `/api/instagram/fetch-comments?access_token=${token}&mediaId=${mediaId}`
    );

    const comments = await commentsResponse.json();
    console.log(comments);
    showResult(await comments);
    commentsList.innerHTML = "";
    let getComment = {};
    if (comments.data) {
      comments.data.data.forEach(async (comment) => {
        const option = document.createElement("option");
        const commentsResponse = await fetch(
          `/api/instagram/get-comment-by-id?commentId=${comment.id}&token=${token}`
        );
        getComment = await commentsResponse.json();
        option.value = getComment.data.id;
        option.textContent = `${getComment.data.from.username}: ${getComment.data.text}`;
        commentsList.appendChild(option);
      });
      replyCommentBtn.classList.add("disable");
    }
    commentsArea.style.display = "block";
    const commentText = document.createElement("p");
    commentText.textContent = `Comment: ${getComment.data.text}`;
    commentText.style.fontSize = "16px";
    commentText.style.fontWeight = "bold";
    commentText.style.marginBottom = "8px";
    commentsArea.appendChild(commentText);
    return comments;
  });

  commentsList.addEventListener("change", async () => {
    commentsArea.style.display = "block";
    const commentText = document.createElement("p");
    commentText.textContent = `Comment: ${getComment.data.text}`;
    commentText.style.fontSize = "16px";
    commentText.style.fontWeight = "bold";
    commentText.style.marginBottom = "8px";
    commentsArea.appendChild(commentText);
  });

  replyCommentBtn.addEventListener("click", async () => {
    const commentId = commentsList.value
      ? commentsList.value
      : alert("Please Fetch comments first");
    const message = replyMessageText.value
      ? replyMessageText.value
      : alert("Please enter a reply message");
    if (!commentId) throw new Error("Comment ID not found");
    if (!message) throw new Error("Reply Text not found");

    const response = await fetch(
      `/api/instagram/reply-comment?commentId=${commentId}&message=${message}&token=${token}`,
      { method: "POST" }
    );
    const data = await response.json();
    console.log(data);
    showResult(data);
    alert(`Comment ${commentId} replied with: ${message}`);
  });

  getIgUserId.addEventListener("click", async () => {
    const userAccessToken = prompt("Enter your Facebook User Access Token");

    // Etapa 1: Obter páginas que o usuário administra
    const pagesRes = await fetch(
      `https://graph.facebook.com/v22.0/me/accounts?access_token=${userAccessToken}`
    );
    const pagesData = await pagesRes.json();
    console.log("Pages Data:", pagesData);

    if (!pagesData.data || pagesData.data.length === 0) {
      alert(
        "Nenhuma página encontrada. Verifique se o usuário administra uma página."
      );
      return;
    }

    // Para simplificar, usamos a primeira página
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;
    const pageId = page.id;

    // Etapa 2: Obter Instagram Business Account vinculado à página
    const igRes = await fetch(
      `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    const igData = await igRes.json();
    console.log("Instagram Business Account:", igData);

    if (!igData.instagram_business_account) {
      alert("Essa página não tem uma conta do Instagram vinculada.");
      return;
    }

    const igUserId = igData.instagram_business_account.id;
    alert(`Instagram Business Account ID: ${igUserId}`);

    // Atualiza o campo de IG User ID automaticamente se existir
    const userIdField = document.getElementById("userId");
    if (userIdField) {
      userIdField.value = igUserId;
    }
  });
  fetchMessagesBtn.addEventListener("click", async () => {
    const fetchConversationsResponse = await fetch(
      `/api/instagram/fetch-ig-conversations?userId=${userId}&token=${token}`
    );
    const fetchedData = await fetchConversationsResponse.json();

    const conversationList = document.getElementById("conversationList");
    conversationList.innerHTML = "";
    if (fetchedData.data.data) {
      fetchedData.data.data.forEach((conversation) => {
        const option = document.createElement("option");
        option.value = conversation.id;
        option.textContent = conversation.id;
        conversationList.appendChild(option);
      });
    }
    document.getElementById("messagesArea").style.display = "block";
  });

  conversationList.addEventListener("change", async () => {
    const conversationId = conversationList.value;
    const fetchMessagesResponse = await fetch(
      `/api/instagram/fetch-message?conversation_id=${conversationId}&token=${token}`
    );

    const messagesData = await fetchMessagesResponse.json();

    console.log("Messages:", messagesData);

    const messageList = document.getElementById("messageList");
    const messageTableBody = document.getElementById("messageTableBody");

    messageList.innerHTML = "";
    messageTableBody.innerHTML = "";

    if (messagesData.data) {
      messagesData.data.forEach((msg) => {
        const option = document.createElement("option");
        option.value = msg.from.id;
        option.textContent = `${msg.from.username}: ${msg.message}`;
        messageList.appendChild(option);

        const tr = document.createElement("tr");

        const tdFrom = document.createElement("td");
        tdFrom.textContent = `${msg.from.username} (${msg.from.id})`;
        tdFrom.style.padding = "4px";
        tdFrom.style.fontSize = "15px";
        tr.appendChild(tdFrom);

        const tdTo = document.createElement("td");
        tdTo.textContent = msg.to.data
          .map((user) => `${user.username} (${user.id})`)
          .join(", ");
        tdTo.style.padding = "4px";
        tdTo.style.fontSize = "15px";
        tr.appendChild(tdTo);

        const tdMessage = document.createElement("td");
        tdMessage.textContent = msg.message;
        tdMessage.style.padding = "4px";
        tdMessage.style.fontSize = "15px";
        tr.appendChild(tdMessage);

        const tdTime = document.createElement("td");
        tdTime.textContent = msg.created_time;
        tdTime.style.padding = "4px";
        tdTime.style.fontSize = "15px";
        tr.appendChild(tdTime);

        messageTableBody.appendChild(tr);
      });
    }

    document.getElementById("messageDetailsArea").style.display = "block";
  });
  messageList.addEventListener("change", () => {
    const replyArea = document.getElementById("replyArea");
    const replyTextarea = document.getElementById("replyMessageText");
    const selectedUserId = document.getElementById("messageList").value;
    const selectedOption =
      document.getElementById("messageList").selectedOptions[0];

    if (selectedUserId) {
      replyTextarea.value = ""; // limpa texto anterior
      replyArea.style.display = "block";

      // Mostrar nome do destinatário acima do textarea
      const label = document.getElementById("replyRecipientLabel");
      label.textContent = `Replying to: ${selectedOption.textContent}`;
      label.style.display = "block";
    } else {
      replyArea.style.display = "none";
      document.getElementById("replyRecipientLabel").style.display = "none";
    }
  });
  sendReplyBtn.addEventListener("click", async () => {
    console.log('username', username);
    const recipientId = document.getElementById("messageList").value;
    const messageText = document.getElementById("replyMessageText").value;
    const res = await fetch(
      `/api/instagram/reply-to-ig-message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          token,
          recipientId,
          messageText,
        }),
      }
    );

    const data = await res.json();
    console.log("Reply Result:", data);
    alert('message sent succesfully', JSON.stringify(data));
  });
});

const showResult = (data) => {
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
};
