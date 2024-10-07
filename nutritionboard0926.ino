#include <WiFi.h>
#include <WebServer.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 21 // RFID 리더기 SS 핀
#define RST_PIN 22 // RFID 리더기 RST 핀

MFRC522 rfid(SS_PIN, RST_PIN); // RFID 객체 생성

const char* ssid = "Hwajeong"; // Wi-Fi SSID
const char* password = "whtsjfja"; // Wi-Fi 비밀번호
const char* serverUrl = "https://nutritionblock.netlify.app/gorugorunutrition.html"; // Netlify URL

void setup() {
  Serial.begin(115200);
  SPI.begin(); // SPI 초기화
  rfid.PCD_Init(); // RFID 리더기 초기화

  WiFi.softAP(ssid, password); // ESP32를 Wi-Fi 핫스팟으로 설정
  Serial.println("HTTP 서버 시작됨");
}

void loop() {
  // RFID 태그가 인식되었는지 확인
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    // 태그 UID를 문자열로 변환
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uid += String(rfid.uid.uidByte[i], HEX); // UID를 HEX로 변환
    }
    uid.toUpperCase(); // 대문자로 변환
    Serial.println("인식된 UID: " + uid); // UID 출력

    // HTTP POST 요청 전송
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl); // 요청할 서버 URL
      http.addHeader("Content-Type", "application/x-www-form-urlencoded"); // 헤더 추가

      // 데이터 전송
      String httpRequestData = "uid=" + uid; // 전송할 데이터
      int httpResponseCode = http.POST(httpRequestData); // POST 요청

      if (httpResponseCode > 0) {
        String response = http.getString(); // 응답 수신
        Serial.println("응답: " + response); // 응답 출력
      } else {
        Serial.println("오류 발생: " + String(httpResponseCode));
      }
      http.end(); // 연결 종료
    }
    delay(1000); // 태그 인식 후 잠시 대기
  }
}
