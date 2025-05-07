class BallShape {
    constructor(name, color, diameter, mass) {
        this.name = name;
        this.color = color;
        this.diameter = diameter;
        this.mass = mass;
        this.element = null;
    }

    createElement() {
        const elem = document.createElement('div');
        elem.className = this instanceof Star ? 'star' : 'planet';
        elem.style.width = `${this.diameter}px`;
        elem.style.height = `${this.diameter}px`;
        elem.style.backgroundColor = this.color;
        elem.title = `${this.name}\nDiameter: ${this.diameter}px\nMass: ${this.mass}`;
        return elem;
    }

    render(container) {
        this.element = this.createElement();
        container.appendChild(this.element);
        return this;
    }
}

class Star extends BallShape {
    constructor(name, color, diameter, mass) {
        super(name, color, diameter, mass);
        this.type = 'star';
    }

    createElement() {
        const elem = super.createElement();
        // Add star glow effect
        elem.style.boxShadow = `0 0 ${this.diameter}px ${this.color}`;
        return elem;
    }

    positionAtCenter(container) {
        if (this.element) {
            this.element.style.left = '50%';
            this.element.style.top = '50%';
        }
        return this;
    }
}

class Planet extends BallShape {
    constructor(name, color, diameter, mass, orbitRadius, orbitSpeed, rotationSpeed) {
        super(name, color, diameter, mass);
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed; // in seconds for one revolution
        this.rotationSpeed = rotationSpeed; // in seconds for one rotation
        this.angle = Math.random() * 360; // Start at random position
        this.orbitElement = null;
        this.type = 'planet';
    }

    createOrbit(container) {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = `${this.orbitRadius * 2}px`;
        orbit.style.height = `${this.orbitRadius * 2}px`;
        orbit.style.left = '50%';
        orbit.style.top = '50%';
        container.appendChild(orbit);
        this.orbitElement = orbit;
        return this;
    }

    createElement() {
        const elem = super.createElement();
        // Add planet rotation animation
        elem.style.animation = `rotate ${this.rotationSpeed}s linear infinite`;
        
        // Create keyframes for rotation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rotate {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        return elem;
    }

    updatePosition(time) {
        if (!this.element) return;
        
        // Calculate current angle based on time and orbit speed
        this.angle = (time / this.orbitSpeed) * 360;
        
        // Convert angle to radians
        const radians = (this.angle * Math.PI) / 180;
        
        // Calculate position
        const centerX = 750; // Half of 1500px
        const centerY = 400; // Half of 800px
        const x = centerX + this.orbitRadius * Math.cos(radians);
        const y = centerY + this.orbitRadius * Math.sin(radians);
        
        // Update element position
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}

// Create specific planet classes
class Mercury extends Planet {
    constructor() {
        super(
            'Mercury', 
            '#a8a8a8', 
            8, 
            0.055, 
            100, 
            2.4, 
            140.8
        );
    }
}

class Venus extends Planet {
    constructor() {
        super(
            'Venus', 
            '#e6c229', 
            12, 
            0.815, 
            150, 
            6.2, 
            243
        );
    }
}

class Earth extends Planet {
    constructor() {
        super(
            'Earth', 
            '#3498db', 
            12.5, 
            1, 
            200, 
            10, 
            1
        );
    }
}

class Mars extends Planet {
    constructor() {
        super(
            'Mars', 
            '#e27b58', 
            10, 
            0.107, 
            280, 
            18.8, 
            1.03
        );
    }
}

class Jupiter extends Planet {
    constructor() {
        super(
            'Jupiter', 
            '#f1c40f', 
            30, 
            317.8, 
            380, 
            118, 
            0.41
        );
    }
}

class Saturn extends Planet {
    constructor() {
        super(
            'Saturn', 
            '#f39c12', 
            25, 
            95.2, 
            480, 
            294, 
            0.45
        );
    }
    
    createElement() {
        const elem = super.createElement();
        // Add Saturn's rings
        const rings = document.createElement('div');
        rings.style.position = 'absolute';
        rings.style.width = '40px';
        rings.style.height = '10px';
        rings.style.backgroundColor = 'transparent';
        rings.style.border = '2px solid #d2b48c';
        rings.style.borderRadius = '50%';
        rings.style.transform = 'translate(-50%, -50%) rotate(20deg)';
        rings.style.top = '50%';
        rings.style.left = '50%';
        elem.appendChild(rings);
        return elem;
    }
}

class Uranus extends Planet {
    constructor() {
        super(
            'Uranus', 
            '#1abc9c', 
            20, 
            14.5, 
            550, 
            840, 
            0.72
        );
    }
}

class Neptune extends Planet {
    constructor() {
        super(
            'Neptune', 
            '#3498db', 
            18, 
            17.1, 
            620, 
            1648, 
            0.67
        );
    }
}

// Solar System Simulation Class
class SolarSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bodies = [];
        this.startTime = Date.now();
        this.animationId = null;
    }

    addBody(body) {
        this.bodies.push(body);
        if (body instanceof Planet) {
            body.createOrbit(this.container);
        }
        body.render(this.container);
        if (body instanceof Star) {
            body.positionAtCenter(this.container);
        }
        return this;
    }

    startSimulation() {
        const animate = () => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - this.startTime) / 1000; // in seconds
            
            // Update planet positions
            this.bodies.forEach(body => {
                if (body instanceof Planet) {
                    body.updatePosition(elapsedTime);
                }
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopSimulation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Create and run the simulation
document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = new SolarSystem('solar-system');
    
    // Add the Sun
    solarSystem.addBody(new Star('Sun', '#f39c12', 50, 333000));
    
    // Add planets (with scaled-down values)
    solarSystem.addBody(new Mercury());
    solarSystem.addBody(new Venus());
    solarSystem.addBody(new Earth());
    solarSystem.addBody(new Mars());
    solarSystem.addBody(new Jupiter());
    solarSystem.addBody(new Saturn());
    solarSystem.addBody(new Uranus());
    solarSystem.addBody(new Neptune());
    
    // Start the simulation
    solarSystem.startSimulation();
});
// 表格控制逻辑
let isTableVisible = false;
let currentSortColumn = -1;
let isAscending = true;

// 点击页面切换表格
document.addEventListener("click", (e) => {
    if (e.target.closest("#infoTable")) return; // 防止点击表格时触发
    const table = document.getElementById("infoTable");
    isTableVisible = !isTableVisible;
    table.style.display = isTableVisible ? "table" : "none";
    if (isTableVisible) updateTable();
});

// 更新表格数据
function updateTable() {
    const columns = ["Name", "Mass", "Orbit Radius", "Color", "Diameter"];
    
    // 生成表头
    document.querySelector("#infoTable thead").innerHTML = `
        <tr>${columns.map((col, i) => `
            <th onclick="sortTable(${i})">
                ${col}
                ${currentSortColumn === i ? (isAscending ? "↑" : "↓") : ""}
            </th>
        `).join("")}</tr>
    `;

    // 生成表格内容（假设你的行星数组叫 planets）
    document.querySelector("#infoTable tbody").innerHTML = planets
        .slice(0, 10)
        .map(planet => `
            <tr>
                <td>${planet.name}</td>
                <td>${planet.mass.toFixed(2)}</td>
                <td>${planet.orbitRadius.toFixed(2)}</td>
                <td>
                    <div class="color-block" style="background:${planet.color}"></div>
                    ${planet.color}
                </td>
                <td>${planet.diameter.toFixed(2)}</td>
            </tr>
        `).join("");
}

// 排序功能
function sortTable(columnIndex) {
    const rows = Array.from(document.querySelectorAll("#infoTable tbody tr"));
    const isNumberCol = ["Mass", "Orbit Radius", "Diameter"].includes(columns[columnIndex]);

    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent;
        const bVal = b.cells[columnIndex].textContent;
        return isNumberCol ? 
            parseFloat(aVal) - parseFloat(bVal) : 
            aVal.localeCompare(bVal);
    });

    if (currentSortColumn === columnIndex && isAscending) {
        rows.reverse();
        isAscending = false;
    } else {
        isAscending = true;
        currentSortColumn = columnIndex;
    }

    document.querySelector("#infoTable tbody").innerHTML = rows.map(row => row.outerHTML).join("");
}