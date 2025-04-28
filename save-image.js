// Save this script to help convert and save the profile image
// This is a browser-based script that you can run in your browser console

function saveImageFromClipboard() {
  console.log("Please paste your image using Ctrl+V");
  
  document.addEventListener('paste', async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Create an image to display
          const img = new Image();
          img.src = e.target.result;
          img.style.maxWidth = '300px';
          img.style.border = '2px solid #333';
          img.style.borderRadius = '8px';
          img.style.margin = '10px';
          
          // Create download link
          const link = document.createElement('a');
          link.href = e.target.result;
          link.download = 'founder-profile.jpg';
          link.textContent = 'Download Image';
          link.style.display = 'block';
          link.style.marginTop = '10px';
          link.style.color = 'blue';
          link.style.textDecoration = 'underline';
          
          // Instructions
          const instructions = document.createElement('p');
          instructions.textContent = 'Right-click the image and select "Save image as..." or click the download link. Save it as "founder-profile.jpg" in the "public" folder of your project.';
          
          // Clear previous content and add new elements
          document.body.innerHTML = '';
          document.body.appendChild(instructions);
          document.body.appendChild(img);
          document.body.appendChild(link);
        };
        
        reader.readAsDataURL(blob);
      }
    }
  });
}

// Run this function in your browser console
saveImageFromClipboard(); 