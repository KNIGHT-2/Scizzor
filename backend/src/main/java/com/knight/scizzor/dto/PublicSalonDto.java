package com.knight.scizzor.dto;

import java.util.List;

public class PublicSalonDto {
    private String name;
    private String username;
    private String logoUrl;
    private String bio;
    private String phone;
    private String address;
    private List<PublicServiceDto> services;
    private List<PublicProductDto> products;

    public PublicSalonDto() {}

    public PublicSalonDto(String name, String username, String logoUrl, String bio, String phone, String address, List<PublicServiceDto> services, List<PublicProductDto> products) {
        this.name = name;
        this.username = username;
        this.logoUrl = logoUrl;
        this.bio = bio;
        this.phone = phone;
        this.address = address;
        this.services = services;
        this.products = products;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<PublicServiceDto> getServices() { return services; }
    public void setServices(List<PublicServiceDto> services) { this.services = services; }

    public List<PublicProductDto> getProducts() { return products; }
    public void setProducts(List<PublicProductDto> products) { this.products = products; }
}
