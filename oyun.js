let kamera;
let poseNet;
let vucutBicimi = [];

// Kuşumuzun ekrandaki başlangıç konumu
let kusX = 320;
let kusY = 240;

function setup() {
    // 640x480 boyutunda bir çizim alanı (oyun ekranı) oluştur
    createCanvas(640, 480);
    
    // Kamerayı aç, orijinal videoyu gizle (biz kendimiz tuvale çizeceğiz)
    kamera = createCapture(VIDEO);
    kamera.size(width, height);
    kamera.hide(); 

    // ml5.js PoseNet yapay zeka modelini başlat
    poseNet = ml5.poseNet(kamera, modelHazir);
    poseNet.on('pose', (sonuclar) => {
        vucutBicimi = sonuclar; // Kamera bir vücut görürse kordinatları kaydet
    });
}

function modelHazir() {
    console.log("Yapay zeka hazır! Oyun başlıyor...");
}

function draw() {
    // Aynadaki gibi hareket etmek için ekranı ters çeviriyoruz
    push();
    translate(width, 0);
    scale(-1, 1);
    image(kamera, 0, 0, width, height);
    pop();

    // Eğer ekranda bir insan vücudu algılandıysa işlemlere başla
    if (vucutBicimi.length > 0) {
        let poz = vucutBicimi[0].pose;
        
        // Sol ve sağ bilek noktalarını al
        let solBilek = poz.leftWrist;
        let sagBilek = poz.rightWrist;
        
        // Kamera kollarımızı net görüyorsa (güvenilirlik testi)
        if (solBilek.confidence > 0.2 && sagBilek.confidence > 0.2) {
            
            // Kolların eğimini hesapla (İki bilek arasındaki yükseklik farkı)
            let egim = solBilek.y - sagBilek.y;
            
            // Eğer sağa doğru eğildiysek
            if (egim > 40) {
                kusX += 5; // Kuşu sağa hareket ettir
            }
            // Eğer sola doğru eğildiysek
            else if (egim < -40) {
                kusX -= 5; // Kuşu sola hareket ettir
            }

            // Kollarımızın hizasını ekranda sarı bir çizgiyle gösterelim
            stroke(255, 255, 0);
            strokeWeight(4);
            line(width - solBilek.x, solBilek.y, width - sagBilek.x, sagBilek.y);
        }
    }

    // Kuşun ekranın dışına çıkıp kaybolmasını engelle
    kusX = constrain(kusX, 25, width - 25);

    // Kuş Karakterini Çizelim (Şimdilik basit bir gövde ve kafa)
    noStroke();
    fill(50, 150, 255);
    ellipse(kusX, kusY, 50, 50); // Gövde (Mavi Daire)
    
    fill(255, 100, 100);
    triangle(kusX - 25, kusY, kusX + 25, kusY, kusX, kusY - 30); // Kafa (Kırmızı Üçgen)
}
