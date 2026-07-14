# Hướng Dẫn Tích Hợp và Gọi Google Maps API

Tài liệu này hướng dẫn chi tiết cách thiết lập, bảo mật và tích hợp Google Maps Platform vào cả **Frontend (React + TypeScript + Vite)** và **Backend (Spring Boot)**.

---

## 1. Thiết Lập Trên Google Cloud Console

Để sử dụng Google Maps API, bạn cần có một tài khoản Google Cloud và một dự án được bật các API tương ứng.

### Bước 1: Tạo dự án mới (hoặc chọn dự án hiện tại)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Đăng nhập bằng tài khoản Google.
3. Ở góc trên cùng bên trái, nhấp vào menu thả xuống dự án và chọn **New Project** (Dự án mới). Nhập tên dự án và nhấn **Create**.

### Bước 2: Kích hoạt (Enable) các API cần thiết
Tùy thuộc vào tính năng bạn muốn xây dựng, hãy vào **APIs & Services** > **Library** và tìm kiếm rồi nhấn **Enable** các API sau:
* **Maps JavaScript API**: Hiển thị bản đồ tương tác trên ứng dụng web/frontend.
* **Places API**: Tìm kiếm địa điểm, gợi ý tự động (Autocomplete), thông tin chi tiết địa điểm.
* **Geocoding API**: Chuyển đổi giữa địa chỉ (chuỗi text) và tọa độ (Kinh độ/Vĩ độ) và ngược lại.
* **Directions API**: Tìm đường đi giữa các điểm, tính toán khoảng cách và thời gian di chuyển.

### Bước 3: Tạo API Key
1. Đi tới **APIs & Services** > **Credentials** (Thông tin xác thực).
2. Nhấp vào **+ Create Credentials** và chọn **API key**.
3. Một hộp thoại sẽ hiện ra hiển thị API Key của bạn. Hãy sao chép nó lại.

> [!IMPORTANT]
> **Thiết lập thanh toán (Billing):** Google Cloud yêu cầu bạn phải liên kết một tài khoản thanh toán (Billing Account - thẻ tín dụng) để sử dụng Google Maps API. Tuy nhiên, Google tặng bạn $200 miễn phí mỗi tháng (đủ cho lưu lượng truy cập nhỏ và thử nghiệm).

### Bước 4: Bảo mật API Key (Bắt buộc cho môi trường Product)
Để tránh người khác đánh cắp API Key của bạn và sử dụng trái phép làm phát sinh chi phí:
1. Tại trang **Credentials**, nhấp vào biểu tượng chỉnh sửa (hình bút chì) bên cạnh API Key vừa tạo.
2. Dưới mục **Set an application restriction** (Hạn chế ứng dụng):
   * Đối với API Key dùng ở Frontend: Chọn **Web sites** và thêm domain ứng dụng của bạn (ví dụ: `http://localhost:5173/*` cho chạy thử và `https://yourdomain.com/*` cho production).
3. Dưới mục **API restrictions** (Hạn chế API):
   * Chọn **Restrict key** và chỉ tích chọn các API mà khóa này được phép gọi (ví dụ: Maps JavaScript API, Places API).

---

## 2. Tích Hợp Vào Frontend (React + TypeScript + Vite)

Dự án Frontend của bạn nằm ở thư mục `FE` sử dụng Vite + TS. Chúng ta sẽ sử dụng thư viện chính thức và phổ biến nhất: `@react-google-maps/api`.

### Bước 1: Cài đặt thư viện
Chạy lệnh sau tại thư mục `FE`:
```bash
npm install @react-google-maps/api
```

### Bước 2: Cấu hình biến môi trường
Tạo hoặc mở file `.env` tại thư mục gốc của frontend (`FE/.env`):
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

### Bước 3: Viết Component Bản Đồ (React TSX)
Dưới đây là một ví dụ về Component bản đồ cơ bản hiển thị một Marker (ghim vị trí) và hỗ trợ tự động tìm kiếm địa chỉ (Autocomplete).

Tạo file `FE/src/components/GoogleMapComponent.tsx`:
```tsx
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

// Định nghĩa kích thước bản đồ
const containerStyle = {
  width: '100%',
  height: '500px'
};

// Tọa độ mặc định (Ví dụ: Thành phố Hồ Chí Minh)
const defaultCenter = {
  lat: 10.762622,
  lng: 106.660172
};

// Khai báo thư viện bổ sung cần tải (ví dụ: places để dùng autocomplete)
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export const GoogleMapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Xử lý khi chọn một địa điểm từ ô tìm kiếm Autocomplete
  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      const location = place.geometry?.location;
      if (location) {
        const newCoords = {
          lat: location.lat(),
          lng: location.lng()
        };
        setMarkerPosition(newCoords);
        map?.panTo(newCoords);
        map?.setZoom(15);
        console.log("Địa chỉ đã chọn:", place.formatted_address);
        console.log("Tọa độ:", newCoords);
      }
    } else {
      console.log('Autocomplete chưa được tải xong!');
    }
  };

  if (loadError) {
    return <div className="text-red-500 font-semibold p-4">Đã xảy ra lỗi khi tải Google Maps.</div>;
  }

  return isLoaded ? (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="relative z-10">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm địa điểm:</label>
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Nhập địa chỉ cần tìm..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Đặt Marker tại vị trí đã chọn */}
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        <p><strong>Vĩ độ (Lat):</strong> {markerPosition.lat}</p>
        <p><strong>Kinh độ (Lng):</strong> {markerPosition.lng}</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default GoogleMapComponent;
```

---

## 3. Tích Hợp Vào Backend (Spring Boot / Java)

Khi bạn cần gọi các dịch vụ của Google Maps như **Geocoding** (chuyển đổi địa chỉ sang tọa độ), **Directions** (đường đi) từ Server để lưu vào cơ sở dữ liệu hoặc xử lý nghiệp vụ, bạn nên gọi từ Backend để bảo mật API Key tuyệt đối.

### Bước 1: Thêm Dependency vào `pom.xml`
Google cung cấp thư viện SDK chính thức cho Java. Mở file `backend/BE/pom.xml` và thêm dependency sau:

```xml
<dependency>
    <groupId>com.google.maps</groupId>
    <artifactId>google-maps-services</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Bước 2: Cấu hình API Key trong Spring Boot
Thêm API Key vào file cấu hình `backend/BE/src/main/resources/application.properties` (hoặc `application.yml`):
```properties
google.maps.api-key=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

### Bước 3: Tạo Google Maps Config Bean
Tạo một Configuration Class để khởi tạo `GeoApiContext` dùng chung cho toàn bộ ứng dụng.

Tạo file `backend/BE/src/main/java/com/example/chaynow/config/GoogleMapsConfig.java` (thay đổi package cho phù hợp):
```java
package com.example.chaynow.config;

import com.google.maps.GeoApiContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleMapsConfig {

    @Value("${google.maps.api-key}")
    private String apiKey;

    @Bean
    public GeoApiContext geoApiContext() {
        return new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();
    }
}
```

### Bước 4: Tạo Service gọi Geocoding API
Service này sẽ nhận vào một chuỗi địa chỉ (ví dụ: `"Tòa nhà Landmark 81, TP.HCM"`) và trả về tọa độ Kinh độ/Vĩ độ.

Tạo file `backend/BE/src/main/java/com/example/chaynow/service/MapService.java`:
```java
package com.example.chaynow.service;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MapService {

    @Autowired
    private GeoApiContext geoApiContext;

    /**
     * Chuyển đổi địa chỉ sang Tọa độ (Vĩ độ & Kinh độ)
     * @param address Chuỗi địa chỉ cần tìm
     * @return LatLng đối tượng chứa lat và lng
     */
    public LatLng getCoordinates(String address) {
        try {
            GeocodingResult[] results = GeocodingApi.geocode(geoApiContext, address).await();
            if (results != null && results.length > 0) {
                return results[0].geometry.location;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // Hoặc ném Exception tùy theo thiết kế của dự án
    }
}
```

### Bước 5: Tạo REST Controller để kiểm tra
Tạo API Endpoint để Frontend có thể gọi lên Backend lấy tọa độ.

Tạo file `backend/BE/src/main/java/com/example/chaynow/controller/MapController.java`:
```java
package com.example.chaynow.controller;

import com.example.chaynow.service.MapService;
import com.google.maps.model.LatLng;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MapController {

    @Autowired
    private MapService mapService;

    @GetMapping("/api/map/geocode")
    public ResponseEntity<?> getGeocode(@RequestParam String address) {
        LatLng coordinates = mapService.getCoordinates(address);
        if (coordinates != null) {
            return ResponseEntity.ok(coordinates);
        }
        return ResponseEntity.badRequest().body("Không thể tìm thấy tọa độ cho địa chỉ đã cung cấp.");
    }
}
```

---

## 4. Các Lưu Ý Về Chi Phí và Tối Ưu Hóa

* **Quản lý hạn mức (Quotas & Limits):** Trên Google Cloud Console, bạn có thể cấu hình hạn mức tối đa số lượng request mỗi ngày cho mỗi API (ví dụ: giới hạn tối đa 1000 requests/ngày đối với Places API) để tránh bị tính phí ngoài dự kiến nếu có sự cố lặp vòng lặp vô tận (infinite loop) hoặc bị spam.
* **Sử dụng debounce:** Khi làm ô tìm kiếm tự động Autocomplete ở Frontend, hãy đảm bảo thư viện tự động tối ưu hóa số lượng truy vấn, chỉ gửi request khi người dùng ngừng gõ (thư viện `@react-google-maps/api` đã xử lý tối ưu hóa việc này).
* **Cache kết quả:** Đối với các truy vấn ít thay đổi (ví dụ: Geocoding một địa chỉ tĩnh của nhà xe, cửa hàng), hãy lưu kết quả Kinh độ/Vĩ độ vào database của bạn thay vì gọi API của Google mỗi lần người dùng tải trang.

---
*Tài liệu được biên soạn cho dự án ChayNow.*
