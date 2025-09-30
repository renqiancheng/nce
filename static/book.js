(() => {
    document.addEventListener('DOMContentLoaded', () => {
        /** 读取 URL hash 并构造资源路径 */
        const idx = location.hash.slice(1).split('?')[0];
        let bookNumber = idx.replace("NCE", "")
        if (!bookNumber) {
            bookNumber = 1
        }
        let lessonsData = {}
        document.getElementById(`book-${bookNumber}`).classList.add('active');
        
        // 高亮当前选中的导航链接
        updateActiveNavLink(bookNumber);

        loadData().then(() => {
            // 初始化所有课文列表
            for (let i = 1; i <= 4; i++) {
                generateLessons(i);
            }
        })
        
        // 监听锚点变化
        window.addEventListener('hashchange', () => {
            const newIdx = location.hash.slice(1).split('?')[0];
            let newBookNumber = newIdx.replace("NCE", "")
            if (!newBookNumber || newBookNumber < 1 || newBookNumber > 4) {
                newBookNumber = 1
            }
            
            // 移除所有激活状态
            document.querySelectorAll('.book-container').forEach(container => {
                container.classList.remove('active');
            });
            
            // 添加新的激活状态
            document.getElementById(`book-${newBookNumber}`).classList.add('active');
            
            // 更新导航链接高亮
            updateActiveNavLink(newBookNumber);
        });
        
        // 更新导航链接高亮的函数
        function updateActiveNavLink(bookNumber) {
            // 移除所有链接的active类
            document.querySelectorAll('.navbar-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // 为当前链接添加active类
            const activeLink = document.querySelector(`.navbar-link[href="#NCE${bookNumber}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }

        async function loadData() {
            const dataSrc = 'static/data.json';
            const dataRes = await fetch(dataSrc);
            lessonsData = await dataRes.json();
        }

        // 生成课文列表的函数
        function generateLessons(bookNumber) {
            const container = document.getElementById(`book-${bookNumber}-lessons`);
            const lessons = lessonsData[bookNumber];

            container.innerHTML = '';
            lessons.forEach((lesson, index) => {
                let lessonNumber = index + 1
                if (bookNumber === 1) {
                    lessonNumber = index * 2 + 1;
                    lessonNumber = `${lessonNumber}&${lessonNumber+1}`;
                }
                const lessonElement = document.createElement('a');
                lessonElement.href = `lesson.html#NCE${bookNumber}/${lesson.filename}`;
                lessonElement.className = 'lesson-item';
                lessonElement.innerHTML = `
                    <span class="lesson-number">第${lessonNumber}课</span>
                    <span class="lesson-title">${lesson.title}</span>
                `;
                container.appendChild(lessonElement);
            });
        }

    })
})()