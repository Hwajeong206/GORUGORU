#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 2
#define RST_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN);  // RFID 리더 설정

// 인식할 RFID 태그의 UID 값과 태그 이름을 정의
String knownTags[] = {"5390718B", "C002D958", "C2765B54"};
String tagNames[] = {"단백질1", "단백질2", "단백질3"};

void setup() {
  Serial.begin(9600);  // 시리얼 통신 시작
  SPI.begin();         // SPI 버스 시작
  mfrc522.PCD_Init();  // RFID 리더 초기화
  Serial.println("Scan an RFID tag");
}

// RFID 태그의 UID 값을 읽어오는 함수
String getUID(byte *buffer, byte bufferSize) {
  String tagUID = "";
  for (byte i = 0; i < bufferSize; i++) {
    tagUID += String(buffer[i] < 0x10 ? "0" : "");
    tagUID += String(buffer[i], HEX);
  }
  tagUID.toUpperCase();
  return tagUID;
}

void loop() {
  // 새로운 카드가 있는지 확인
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // 카드의 데이터를 읽음
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // 카드 UID를 얻음
  String tagUID = getUID(mfrc522.uid.uidByte, mfrc522.uid.size);
  bool tagFound = false;

  // 인식된 태그가 미리 등록된 태그인지 확인
  for (int i = 0; i < 3; i++) {
    if (tagUID.equalsIgnoreCase(knownTags[i])) {
      Serial.println(tagNames[i]);  // 해당 태그 이름을 시리얼로 출력
      tagFound = true;
      break;
    }
  }

  if (!tagFound) {
    Serial.println("Unknown Tag");  // 미리 등록되지 않은 태그일 경우 출력
  }

  // RFID 리더 상태 초기화
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
