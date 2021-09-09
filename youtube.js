//cria uma lista com os vídeos do canal especificado
function funcaoCallback(json){
     var videos = json.items; //array com os vídeos
     var youtubeUrl = 'https://www.youtube.com/watch?v='; //padrão de URL do YouTube
     var output_html = "";
     for(i = 0; i < videos.length; i++){
  output_html += "<div class=\"video-item\">";
  output_html += "<div class=\"content\">";
  output_html += "<a target='_blank' href=\"" + youtubeUrl + videos[i].id.videoId + "\">";
  output_html += "<img src=\""+ videos[i].snippet.thumbnails.medium.url+"\" width=\"" 
         + videos[i].snippet.thumbnails.medium.width + "\" height=\"" 
         + videos[i].snippet.thumbnails.medium.height +"\"/>";
  output_html += "<h2>";  
  output_html += videos[i].snippet.title.substr(0, 70);
  output_html += "</h2>";
  output_html += "<p id='video-desc'>";
  output_html += videos[i].snippet.description.substr(0, 90);
  output_html += "</p>";
  output_html += "</a>";
  output_html += "</div>";
  output_html += "</div>";
     }
     document.getElementById("container").innerHTML = output_html;
}
