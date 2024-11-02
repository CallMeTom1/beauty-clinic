import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateClinicPayload } from './data/payload/update-clinic.payload';
import { Clinic } from "./data/model/clinic.entity";
import { Address } from "@common/model/address.entity";
import { ulid } from "ulid";
import {join} from "path";
import {readFileSync} from "fs";
import {FileUploadException, InvalidFileTypeException} from "@feature/security/security.exception";

@Injectable()
export class ClinicService {
    private readonly defaultClinicLogo: string;

    constructor(
        @InjectRepository(Clinic)
        private readonly clinicRepository: Repository<Clinic>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {
        // Lire et encoder l'image par défaut en base64 lors de l'initialisation du service
        const defaultImageBuffer = readFileSync(join(process.cwd(), 'src', 'feature', 'product', 'assets', 'default-product.png'));
        this.defaultClinicLogo = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;

    }

    // Créer une clinique par défaut
    private async createDefaultClinic(): Promise<Clinic> {
        // Créer d'abord l'adresse par défaut
        const defaultAddress = this.addressRepository.create({
            address_id: ulid(),
            road: "",
            nb: "",
            cp: "",
            town: "",
            country: "",
            complement: ""
        });

        // Sauvegarder l'adresse
        const savedAddress = await this.addressRepository.save(defaultAddress);

        // Créer la clinique avec l'adresse sauvegardée
        const clinic = this.clinicRepository.create({
            clinic_id: ulid(),
            name: "Ma Clinique",
            description: "Description de la clinique",
            clinic_address: savedAddress,
            phone_number: "",
            mail: "",
            facebook_url: "",
            instagram_url: "",
            tiktok_url: "",
            linkedin_url: "",
            clinic_logo: null
        });

        return clinic;
    }

    // Récupérer les informations de la clinique
    async getClinic(): Promise<Clinic> {
        try {
            let clinic = await this.clinicRepository.findOne({
                where: {},
                relations: ['clinic_address']
            });

            if (!clinic) {
                // Créer et sauvegarder une clinique par défaut
                const defaultClinic = await this.createDefaultClinic();
                clinic = await this.clinicRepository.save(defaultClinic);
            }

            return clinic;

        } catch (error) {
            throw new Error('Failed to fetch clinic information');
        }
    }

    // Mettre à jour les informations de la clinique
    async update(payload: UpdateClinicPayload): Promise<Clinic> {
        try {
            const clinic = await this.clinicRepository.findOne({
                where: { clinic_id: payload.clinic_id },
                relations: ['clinic_address']
            });

            if (!clinic) {
                throw new NotFoundException(`Clinic with id ${payload.clinic_id} not found`);
            }

            // Mise à jour des champs de base
            if (payload.name !== undefined) clinic.name = payload.name;
            if (payload.description !== undefined) clinic.description = payload.description;
            if (payload.phone_number !== undefined) clinic.phone_number = payload.phone_number;
            if (payload.mail !== undefined) clinic.mail = payload.mail;
            if (payload.facebook_url !== undefined) clinic.facebook_url = payload.facebook_url;
            if (payload.instagram_url !== undefined) clinic.instagram_url = payload.instagram_url;
            if (payload.tiktok_url !== undefined) clinic.tiktok_url = payload.tiktok_url;
            if (payload.linkedin_url !== undefined) clinic.linkedin_url = payload.linkedin_url;
            if (payload.clinic_logo !== undefined) clinic.clinic_logo = payload.clinic_logo;

            // Mise à jour de l'adresse si fournie
            if (payload.address) {
                if (clinic.clinic_address) {
                    // Mettre à jour l'adresse existante
                    Object.assign(clinic.clinic_address, payload.address);
                    await this.addressRepository.save(clinic.clinic_address);
                } else {
                    // Créer une nouvelle adresse
                    const newAddress = this.addressRepository.create({
                        address_id: ulid(),
                        ...payload.address
                    });
                    clinic.clinic_address = await this.addressRepository.save(newAddress);
                }
            }

            return await this.clinicRepository.save(clinic);

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update clinic information');
        }
    }

    // Mettre à jour le logo de la clinique
    async updateClinicLogo(clinicId: string, file: Express.Multer.File): Promise<Clinic> {
        try {
            console.log('File received in service:', file);
            console.log('Clinic ID:', clinicId);

            const clinic = await this.clinicRepository.findOne({
                where: { clinic_id: clinicId },
                relations: ['clinic_address']
            });

            if (!clinic) {
                throw new NotFoundException(`Clinic with id ${clinicId} not found`);
            }

            if (!file) {
                throw new FileUploadException();
            }

            // Vérifier le type MIME du fichier
            const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new InvalidFileTypeException();
            }

            // Encodage en base64
            const base64Image = file.buffer.toString('base64');
            clinic.clinic_logo = `data:${file.mimetype};base64,${base64Image}`;

            return await this.clinicRepository.save(clinic);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Failed to update clinic logo');
        }
    }
}