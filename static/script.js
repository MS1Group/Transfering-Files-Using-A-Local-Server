let currentPath = "";
let selectedFile = "";
let selectedFiles = new Set();
let isMultiSelectMode = false;
let selectedItemIsFolder = false;

const grid = document.getElementById("file-grid");
const search = document.getElementById("search");
const menu = document.getElementById("context-menu");
const breadcrumb = document.getElementById("breadcrumb");
const deleteSelectedBtn = document.getElementById("delete-selected-btn");

function icon(name, isDir) {
  if (isDir) return "📁";
  if (name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) return "🖼️";
  if (name.match(/\.(mp4|mov|avi|mkv)$/i)) return "🎞️";
  if (name.match(/\.(pdf|doc|docx)$/i)) return "📄";
  if (name.match(/\.(zip|rar|7z|tar|gz)$/i)) return "📦";
  if (name.match(/\.(mp3|wav|flac|m4a)$/i)) return "🎵";
  if (name.match(/\.(js|py|java|cpp|css|html)$/i)) return "💻";
  if (name.match(/\.(txt|md)$/i)) return "📝";
  return "📄";
}

function updateBreadcrumb(path) {
  if (!path || path === "") {
    breadcrumb.innerHTML = "Main";
    return;
  }

  const parts = path.split("/").filter(p => p);
  let html = '<span class="breadcrumb-item" data-path="">Main</span>';
  
  let buildPath = "";
  parts.forEach((part, idx) => {
    buildPath += (buildPath ? "/" : "") + part;
    html += ` <span style="color: var(--text-secondary); margin: 0 4px;">/</span> `;
    html += `<span class="breadcrumb-item" data-path="${buildPath}">${part}</span>`;
  });
  
  breadcrumb.innerHTML = html;

  // Add click handlers to breadcrumb items
  document.querySelectorAll(".breadcrumb-item").forEach(item => {
    item.style.cursor = "pointer";
    item.style.fontWeight = "600";
    item.style.transition = "color 0.2s ease";
    
    item.addEventListener("mouseenter", () => {
      item.style.color = "var(--text-primary)";
    });
    
    item.addEventListener("mouseleave", () => {
      item.style.color = "var(--text-secondary)";
    });
    
    item.addEventListener("click", () => {
      const path = item.getAttribute("data-path");
      loadFiles(path);
    });
  });
}

function loadFiles(path = "") {
  // Add loading state
  grid.innerHTML = '<div class="loading" style="text-align: center; padding: 60px; font-size: 48px;">⏳</div>';
  
  // Clear selection when changing directories
  selectedFiles.clear();
  updateDeleteSelectedButton();
  
  fetch(`/files?path=${path}`)
    .then(r => r.json())
    .then(items => {
      grid.innerHTML = "";
      currentPath = path;

      updateBreadcrumb(path);

      if (items.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1/-1;">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-text">No files found</div>
          </div>
        `;
        return;
      }

      // Sort: directories first, then by name
      items.sort((a, b) => {
        if (a.is_dir !== b.is_dir) return b.is_dir ? 1 : -1;
        return a.name.localeCompare(b.name);
      });

      items.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "file-card";
        card.style.animationDelay = `${idx * 0.03}s`;

        const fullPath = path ? `${path}/${item.name}` : item.name;
        card.dataset.path = fullPath;
        card.dataset.isDir = item.is_dir;

        if (!item.is_dir && item.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
          card.innerHTML = `
            <div class="mobile-menu-btn" data-path="${fullPath}" data-isdir="${item.is_dir}">⋮</div>
            <img src="/open/${fullPath}" alt="${item.name}" loading="lazy">
            <div>${item.name}</div>
          `;
        } else {
          card.innerHTML = `
            <div class="mobile-menu-btn" data-path="${fullPath}" data-isdir="${item.is_dir}">⋮</div>
            <div class="file-icon">${icon(item.name, item.is_dir)}</div>
            <div>${item.name}</div>
          `;
        }

        // Click handler
        card.onclick = (e) => {
          // Multi-select with Ctrl/Cmd key
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleSelection(card, fullPath);
            return;
          }
          
          // Normal click behavior
          if (selectedFiles.size > 0) {
            // If in multi-select mode, clear selection
            clearSelection();
          }
          
          if (item.is_dir) {
            loadFiles(fullPath);
          } else {
            window.open(`/open/${fullPath}`, "_blank");
          }
        };

        // Right-click context menu
        card.oncontextmenu = e => {
          e.preventDefault();
          selectedFile = fullPath;
          selectedItemIsFolder = item.is_dir;
          
          // Show/hide appropriate menu items
          document.getElementById("download-btn").style.display = item.is_dir ? "none" : "block";
          document.getElementById("delete-btn").style.display = item.is_dir ? "none" : "block";
          document.getElementById("delete-folder-btn").style.display = item.is_dir ? "block" : "none";
          
          menu.style.display = "block";
          menu.style.left = e.pageX + "px";
          menu.style.top = e.pageY + "px";
        };

        grid.appendChild(card);
        
        // Mobile menu button handler
        const mobileMenuBtn = card.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
          mobileMenuBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent card click
            selectedFile = fullPath;
            selectedItemIsFolder = item.is_dir;
            
            // Show/hide appropriate menu items
            document.getElementById("download-btn").style.display = item.is_dir ? "none" : "block";
            document.getElementById("delete-btn").style.display = item.is_dir ? "none" : "block";
            document.getElementById("delete-folder-btn").style.display = item.is_dir ? "block" : "none";
            
            // Position menu near the button
            const rect = mobileMenuBtn.getBoundingClientRect();
            menu.style.display = "block";
            menu.style.left = (rect.left - 140) + "px"; // Position to left of button
            menu.style.top = (rect.bottom + 5) + "px";
          };
        }
      });
    })
    .catch(err => {
      console.error("Error loading files:", err);
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-text">Error loading files</div>
        </div>
      `;
    });
}

function toggleSelection(card, path) {
  if (selectedFiles.has(path)) {
    selectedFiles.delete(path);
    card.classList.remove('selected');
  } else {
    selectedFiles.add(path);
    card.classList.add('selected');
  }
  updateDeleteSelectedButton();
}

function clearSelection() {
  selectedFiles.clear();
  document.querySelectorAll('.file-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  updateDeleteSelectedButton();
}

function updateDeleteSelectedButton() {
  if (selectedFiles.size > 0) {
    deleteSelectedBtn.style.display = "block";
    deleteSelectedBtn.textContent = `🗑️ Delete Selected (${selectedFiles.size})`;
  } else {
    deleteSelectedBtn.style.display = "none";
  }
}

// Search functionality
search.oninput = () => {
  const searchTerm = search.value.toLowerCase();
  
  document.querySelectorAll(".file-card").forEach(card => {
    const fileName = card.textContent.toLowerCase();
    const matches = fileName.includes(searchTerm);
    card.style.display = matches ? "block" : "none";
  });

  // Show message if no results
  const visibleCards = Array.from(document.querySelectorAll(".file-card"))
    .filter(card => card.style.display !== "none");
  
  if (visibleCards.length === 0 && searchTerm) {
    if (!document.querySelector(".no-results")) {
      const noResults = document.createElement("div");
      noResults.className = "empty-state no-results";
      noResults.style.gridColumn = "1/-1";
      noResults.innerHTML = `
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No files match "${searchTerm}"</div>
      `;
      grid.appendChild(noResults);
    }
  } else {
    const noResults = document.querySelector(".no-results");
    if (noResults) noResults.remove();
  }
};

// Download button
document.getElementById("download-btn").onclick = () => {
  window.location = `/download/${selectedFile}`;
  menu.style.display = "none";
};

document.getElementById("delete-btn").onclick = async () => {
  menu.style.display = "none";
  
  const fileName = selectedFile.split('/').pop();
  const confirmDelete = confirm(`Are you sure you want to delete "${fileName}"?\n\nThis action cannot be undone.`);
  
  if (!confirmDelete) return;
  
  try {
    const response = await fetch(`/delete/${selectedFile}`, {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(`✅ File "${fileName}" deleted successfully`);
      loadFiles(currentPath); // Refresh the file list
    } else {
      alert(`❌ Error: ${data.error || 'Failed to delete file'}`);
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("❌ Failed to delete file");
  }
};

document.getElementById("delete-folder-btn").onclick = async () => {
  menu.style.display = "none";
  
  const folderName = selectedFile.split('/').pop();
  const confirmDelete = confirm(`Are you sure you want to delete folder "${folderName}"?\n\nNote: Only empty folders can be deleted.`);
  
  if (!confirmDelete) return;
  
  try {
    const response = await fetch(`/delete-folder/${selectedFile}`, {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(`✅ Folder "${folderName}" deleted successfully`);
      loadFiles(currentPath);
    } else {
      alert(`❌ Error: ${data.error || 'Failed to delete folder'}`);
    }
  } catch (err) {
    console.error("Delete folder error:", err);
    alert("❌ Failed to delete folder");
  }
};

// New folder creation
document.getElementById("new-folder-btn").onclick = async () => {
  const folderName = prompt("Enter folder name:");
  
  if (!folderName || folderName.trim() === "") return;
  
  try {
    const response = await fetch('/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: folderName.trim(),
        path: currentPath
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(`✅ Folder "${folderName}" created successfully`);
      loadFiles(currentPath);
    } else {
      alert(`❌ Error: ${data.error || 'Failed to create folder'}`);
    }
  } catch (err) {
    console.error("Create folder error:", err);
    alert("❌ Failed to create folder");
  }
};

// Delete multiple selected files
deleteSelectedBtn.onclick = async () => {
  if (selectedFiles.size === 0) return;
  
  const count = selectedFiles.size;
  const confirmDelete = confirm(`Are you sure you want to delete ${count} file(s)?\n\nThis action cannot be undone.`);
  
  if (!confirmDelete) return;
  
  deleteSelectedBtn.textContent = "⏳ Deleting...";
  deleteSelectedBtn.disabled = true;
  
  try {
    const response = await fetch('/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: Array.from(selectedFiles)
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const message = `✅ Deleted ${data.deleted} file(s)${data.failed > 0 ? `\n❌ Failed: ${data.failed}` : ''}`;
      alert(message);
      clearSelection();
      loadFiles(currentPath);
    } else {
      alert(`❌ Error: ${data.error || 'Failed to delete files'}`);
    }
  } catch (err) {
    console.error("Delete multiple error:", err);
    alert("❌ Failed to delete files");
  } finally {
    deleteSelectedBtn.disabled = false;
    updateDeleteSelectedButton();
  }
};

// Close context menu on click outside
document.onclick = () => {
  menu.style.display = "none";
};

// Dark mode toggle with persistence
const toggleDark = document.getElementById("toggle-dark");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggleDark.textContent = "☀️";
}

toggleDark.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleDark.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Keyboard shortcuts
document.addEventListener("keydown", e => {
  // Escape to close modal, context menu, or clear selection
  if (e.key === "Escape") {
    infoModal.style.display = "none";
    menu.style.display = "none";
    if (selectedFiles.size > 0) {
      clearSelection();
    }
  }
  
  // Backspace to go up one directory (when not focused on search)
  if (e.key === "Backspace" && document.activeElement !== search) {
    e.preventDefault();
    if (currentPath) {
      const parts = currentPath.split("/").filter(p => p);
      parts.pop();
      loadFiles(parts.join("/"));
    }
  }
  
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    search.focus();
  }
  
  // Ctrl/Cmd + A to select all files (not folders)
  if ((e.ctrlKey || e.metaKey) && e.key === "a" && document.activeElement !== search) {
    e.preventDefault();
    document.querySelectorAll('.file-card').forEach(card => {
      if (card.dataset.isDir === "false") {
        selectedFiles.add(card.dataset.path);
        card.classList.add('selected');
      }
    });
    updateDeleteSelectedButton();
  }
});

// Initialize
loadFiles();

// Upload functionality
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");

uploadBtn.onclick = () => {
  fileInput.click();
};

fileInput.onchange = async () => {
  const files = fileInput.files;
  if (files.length === 0) return;

  // Show uploading indicator
  uploadBtn.textContent = "⏳ Uploading...";
  uploadBtn.disabled = true;

  let successCount = 0;
  let failCount = 0;

  for (let file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      console.error("Upload error:", err);
      failCount++;
    }
  }

  // Reset button
  uploadBtn.textContent = "📤 Upload";
  uploadBtn.disabled = false;
  fileInput.value = "";

  // Show result
  if (successCount > 0) {
    alert(`✅ Successfully uploaded ${successCount} file(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);
    loadFiles(currentPath); // Refresh the file list
  } else {
    alert("❌ Upload failed");
  }
};

// Logout functionality
document.getElementById("logout-btn").onclick = () => {
  window.location.href = "/logout";
};

// Info modal functionality
const infoModal = document.getElementById("info-modal");
const infoBtn = document.getElementById("info-btn");
const closeModal = document.querySelector(".close-modal");

infoBtn.onclick = () => {
  infoModal.style.display = "block";
};

closeModal.onclick = () => {
  infoModal.style.display = "none";
};

// Close modal when clicking outside
window.onclick = (e) => {
  if (e.target === infoModal) {
    infoModal.style.display = "none";
  }
};

// Mobile hamburger menu functionality
const hamburgerBtn = document.getElementById("hamburger-btn");
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenuBtn = document.getElementById("close-menu");
const searchIconBtn = document.getElementById("search-icon-btn");
const searchInput = document.getElementById("search");

function openMenu() {
  sideMenu.classList.add("open");
  menuOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeMenu() {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}

if (hamburgerBtn) {
  hamburgerBtn.onclick = openMenu;
}

if (closeMenuBtn) {
  closeMenuBtn.onclick = closeMenu;
}

if (menuOverlay) {
  menuOverlay.onclick = closeMenu;
}

// Search icon toggle for mobile
if (searchIconBtn) {
  searchIconBtn.onclick = () => {
    searchInput.classList.toggle("expanded");
    searchIconBtn.classList.toggle("hidden");
    
    // Focus on search input when expanded
    if (searchInput.classList.contains("expanded")) {
      setTimeout(() => searchInput.focus(), 100);
    }
  };
  
  // Close search when clicking outside or pressing escape
  document.addEventListener("click", (e) => {
    if (searchInput.classList.contains("expanded") && 
        !searchInput.contains(e.target) && 
        !searchIconBtn.contains(e.target)) {
      searchInput.classList.remove("expanded");
      searchIconBtn.classList.remove("hidden");
      searchInput.value = ""; // Clear search
      // Trigger search to show all files again
      search.oninput();
    }
  });
}

// Mobile menu item handlers
document.getElementById("mobile-new-folder")?.addEventListener("click", () => {
  closeMenu();
  document.getElementById("new-folder-btn").click();
});

document.getElementById("mobile-info")?.addEventListener("click", () => {
  closeMenu();
  infoModal.style.display = "block";
});

document.getElementById("mobile-dark")?.addEventListener("click", () => {
  closeMenu();
  document.getElementById("toggle-dark").click();
});

document.getElementById("mobile-logout")?.addEventListener("click", () => {
  closeMenu();
  window.location.href = "/logout";
});
