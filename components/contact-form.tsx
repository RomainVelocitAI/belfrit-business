'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });
  const [kbisFile, setKbisFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verify file type (PDF, JPEG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non valide. Veuillez uploader un PDF, JPEG ou PNG.');
        return;
      }
      // Verify file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fichier trop volumineux. Taille maximale : 5 MB.');
        return;
      }
      setKbisFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would implement the actual form submission
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        message: '',
      });
      setKbisFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setKbisFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ouvrir un compte professionnel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour créer votre compte BelFrit Business et commencer à commander nos produits belges premium
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom de l'entreprise <span className="text-belfrit-red">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                placeholder="Votre enseigne"
              />
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du contact <span className="text-belfrit-red">*</span>
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                placeholder="Nom et prenom"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email professionnel <span className="text-belfrit-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                placeholder="contact@votreentreprise.fr"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Telephone <span className="text-belfrit-red">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                placeholder="06 XX XX XX XX"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse de livraison <span className="text-belfrit-red">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
              placeholder="Adresse complete de votre etablissement"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Message (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all resize-none"
              placeholder="Dites-nous en plus sur vos besoins..."
            />
          </div>

          {/* Kbis Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kbis de moins de 3 mois <span className="text-belfrit-red">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-belfrit-red transition-colors">
              {!kbisFile ? (
                <div>
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="kbis-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-belfrit-red hover:text-red-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-belfrit-red"
                    >
                      <span>Cliquez pour uploader</span>
                      <input
                        id="kbis-upload"
                        name="kbis-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">ou glissez-deposez</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG jusqu'a 5 MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-8 w-8 text-belfrit-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{kbisFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(kbisFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-belfrit-red hover:text-red-700 font-medium text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Le Kbis permet de verifier l'existence legale de votre entreprise
            </p>
          </div>

          {/* Submit Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-800 font-medium">
                Votre demande a ete envoyee avec succes! Nous vous contacterons sous 48h.
              </p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 font-medium">
                Une erreur est survenue. Veuillez reessayer ou nous contacter directement.
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-belfrit-red text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer ma demande'
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            En soumettant ce formulaire, vous acceptez que vos donnees soient utilisees pour traiter votre demande d'ouverture de compte professionnel.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
