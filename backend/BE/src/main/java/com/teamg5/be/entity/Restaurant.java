package com.teamg5.be.entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Column;
import com.teamg5.be.entity.BaseEntity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant extends BaseEntity {
     
    @Column(nullable = false,length = 255)
    private String name;

    @Column(length = 500)
    private String address;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Column (name = "open_time", nullable = false)
    private LocalTime openTime;
    @Column(name = "closed_time", nullable = false)
    private LocalTime closedTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_restaurant_id", nullable = false)
    private TypeRestaurant typeRestaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    
     // cập nhật trạng tháy hiện tại đống của hay mở của (optional)
    // @Enumerated(EnumType.STRING)
    // @Column(name = "operating_status", nullable = false , length = 20)
    // @Builder.Default
    // private RestaurantStatus restaurantStatus = RestaurantStatus.OPEN;
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Media> mediaList = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant")
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Menu> menus = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Posting> postings = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FavouritePlace> favouritePlaces = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Event> events = new ArrayList<>();
 
}
