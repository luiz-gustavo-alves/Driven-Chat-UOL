# Driven-Chat-UOL 
Implementação de um bate-papo totalmente funcional, inspirado no Bate-Papo UOL, utilizando uma API com Axios para realizar métodos de requisão e resposta cliente-servidor.<br>
<br>

## Requisitos obrigatórios do projeto
### Entrada na sala:<br>
<li> Caso o servidor responda com sucesso, o usuário poderá entrar na sala;</li>
<li> Caso o servidor responda com erro, deve-se pedir para o usuário digitar outro nome, pois este já está em uso;</li>
<li> Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala".</li>
<br>

### Envio de mensagem:<br>
<li>Caso o servidor responda com sucesso, você deve obter novamente as mensagens do servidor e atualizar o *chat;</li>
<li>Caso o servidor responda com erro, significa que esse usuário não está mais na sala e a página deve ser atualizada (e com isso voltando pra etapa de pedir o nome).</li>
<br>

### Visibilidade da mensagem:<br>
<li> No envio da mensagem, deve ser informado o remetente, o destinatário e se a mensagem é reservada (privada) ou não (pública).</li>
<br>

## Design Final do Projeto
https://user-images.githubusercontent.com/114351018/232573352-fc244347-a7c1-477b-9bf3-a68587570009.mp4

## Deploy do Projeto
https://luiz-gustavo-alves.github.io/Driven-Chat-UOL/
