// JavaScript עבור התפריט התחתון

// פונקציה להפעלת ניווט תחתון
document.addEventListener('DOMContentLoaded', function() {
    // בחירת האלמנטים
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');
    const indicatorMask = document.querySelector('.nav-indicator-mask');
    const navList = document.querySelector('.nav-list');
    const curveLeft = document.querySelector('.curve-left');
    const curveRight = document.querySelector('.curve-right');
    
    // מיקום האינדיקטור והקמרונים בפתיחה
    function positionElements(item) {
        if (!item || !indicator || !curveLeft || !curveRight || !indicatorMask) return;
        
        const itemRect = item.getBoundingClientRect();
        const navRect = navList.getBoundingClientRect();
        
        // מיקום האינדיקטור ביחס לתפריט
        const indicatorWidth = indicator.offsetWidth;
        const leftPosition = itemRect.left - navRect.left + (itemRect.width / 2) - (indicatorWidth / 2);
        
        // הגדרת מיקום מדויק לאינדיקטור
        indicator.style.left = leftPosition + 'px';
        
        // מיקום האלמנטים שיוצרים את השיפוע
        curveLeft.style.left = (leftPosition - 15) + 'px';
        curveRight.style.left = (leftPosition + indicatorWidth - 5) + 'px';
        
        // מיקום ורוחב המסכה שמסתירה את קו הגבול העליון
        indicatorMask.style.left = (leftPosition + 5) + 'px';
        indicatorMask.style.width = (indicatorWidth - 10) + 'px';
    }
    
    // מערך לשמירת ניצוצות כוכבים
    let sparks = [];
    
    // פונקציה ליצירת ניצוצות כוכבים
    function createSparks(navItem) {
        // נקה ניצוצות קודמים
        sparks.forEach(spark => {
            if (spark && spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        });
        sparks = [];

        // צור ניצוצות חדשים
        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('div');
            spark.classList.add('star-spark');
            document.querySelector('.bottom-navigation').appendChild(spark);
            
            // מיקום התחלתי של הניצוץ - באיזור הכפתור שנלחץ
            const rect = navItem.getBoundingClientRect();
            const parentRect = document.querySelector('.bottom-navigation').getBoundingClientRect();
            
            const startX = rect.left + rect.width / 2 - parentRect.left;
            const startY = rect.top + rect.height / 2 - parentRect.top;
            
            // מהירות וכיוון רנדומליים
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 3;
            const lifespan = 500 + Math.random() * 1000;
            
            // הגדר מאפיינים
            spark.style.left = startX + 'px';
            spark.style.top = startY + 'px';
            
            // אנימציית תנועה והיעלמות
            gsap.to(spark, {
                x: Math.cos(angle) * (50 + Math.random() * 50),
                y: Math.sin(angle) * (50 + Math.random() * 50),
                opacity: 1,
                duration: 0.1,
                onComplete: function() {
                    gsap.to(spark, {
                        x: Math.cos(angle) * (100 + Math.random() * 100),
                        y: Math.sin(angle) * (100 + Math.random() * 100),
                        opacity: 0,
                        duration: lifespan / 1000,
                        ease: "power1.out",
                        onComplete: function() {
                            if (spark.parentNode) {
                                spark.parentNode.removeChild(spark);
                            }
                        }
                    });
                }
            });
            
            sparks.push(spark);
        }
    }

    // פונקציה להחלפת האייטם הפעיל עם אנימציה מרשימה
    function activateNavItem() {
        // מניעת הפעלה אם כבר פעיל
        if (this.classList.contains('active')) return;
        
        // הסר את הקלאס הפעיל מכל הפריטים
        navItems.forEach(item => {
            if (!item.classList.contains('nav-indicator')) {
                item.classList.remove('active');
            }
        });
        
        // הוסף ניצוצות כוכבים סביב הכפתור הנלחץ
        createSparks(this);
        
        // הוסף קלאס פעיל לפריט שנלחץ
        this.classList.add('active');
        
        // מיקום האינדיקטור והקמרונים תחת הפריט הפעיל
        positionElements(this);
        
        // אנימציית פלאש לאינדיקטור
        gsap.to(indicator, {
            scale: 1.5,
            opacity: 0.8,
            duration: 0.2,
            onComplete: function() {
                gsap.to(indicator, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        });
        
        // אנימציה לאלמנטים שיוצרים את השיפוע והמסכה
        gsap.fromTo([curveLeft, curveRight, indicatorMask], 
            { opacity: 0.5, y: -5 },
            { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
        
        // בעתיד, כאן יהיה קוד למעבר בין הדפים השונים
        // לדוגמה:
        // const targetPage = this.getAttribute('data-target');
        // window.location.href = targetPage + '.html';
    }

    // הוספת מאזיני לחיצה לכל פריטי התפריט
    navItems.forEach(item => {
        // דלג על האינדיקטור
        if (item.classList.contains('nav-indicator')) return;
        
        item.addEventListener('click', activateNavItem);
    });

    // הוספת אפקט hover מותאם
    navItems.forEach(item => {
        // דלג על האינדיקטור
        if (item.classList.contains('nav-indicator')) return;
        
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                gsap.to(this.querySelector('.nav-icon'), {
                    scale: 1.2,
                    y: -10,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                gsap.to(this.querySelector('.nav-icon'), {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
    });
    
    // וודא שהכפתור הראשון מסומן כפעיל בטעינה
    if (navItems.length > 0) {
        // קבל רק את הכפתורים אמיתיים (לא האינדיקטור)
        const actualButtons = Array.from(navItems).filter(item => !item.classList.contains('nav-indicator'));
        if (actualButtons.length > 0) {
            actualButtons[0].classList.add('active');
            // מיקום התחלתי של האינדיקטור והקמרונים
            setTimeout(() => {
                positionElements(actualButtons[0]);
            }, 100);
        }
    }
    
    // לאחר טעינת העמוד, מקם את האינדיקטור והקמרונים שוב (מטפל בשינויי גודל ומקרים אחרים)
    window.addEventListener('load', function() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            positionElements(activeItem);
        }
    });
    
    // מטפל בשינויים בגודל המסך
    window.addEventListener('resize', function() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            positionElements(activeItem);
        }
    });
});
